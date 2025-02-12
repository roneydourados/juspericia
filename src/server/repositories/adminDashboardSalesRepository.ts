import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  AdminDashboardMedicAtendimentHoursProps,
  AdminDashboardMedicRateProps,
  AdminDashboardSalesClientsProps,
  AdminDashBoardSalesFilterProps,
  InvoicingYearProps,
  SalesPaymentFormProps,
  SalesStatusProps,
  SolicitationConsultationStatusProps,
} from "@/types/AdminDashboardSales";
import { months } from "@/utils/FrontConstants";
import moment from "moment";

export const index = async ({
  initialDate,
  finalDate,
  ufs,
}: AdminDashBoardSalesFilterProps) => {
  const initialDateConvert = new Date(initialDate);
  const finalDateConvert = new Date(finalDate);

  const initialYearDate = new Date(
    moment().startOf("year").format("YYYY-MM-DD")
  );
  const finalYearDate = new Date(moment().endOf("year").format("YYYY-MM-DD"));

  //validação do filtro por reigão
  const ufsFilter =
    ufs && ufs.length > 0
      ? `and a.address_state IN (${ufs.map((uf) => `'${uf}'`).join(", ")})`
      : undefined;

  //faturamento anual
  const invoicingYear = await prisma.$queryRaw<InvoicingYearProps[]>`
  select 
    sum(s.value) total,
    case extract(month from s.date_created)
      when 1 then 'Jan'
      when 2 then 'Fev'
      when 3 then 'Mar'
      when 4 then 'Abr'
      when 5 then 'Mai'
      when 6 then 'Jun'
      when 7 then 'Jul'
      when 8 then 'Ago'
      when 9 then 'Set'
      when 10 then 'Out'
      when 11 then 'Nov'
      when 12 then 'Dez'
    end as month
  from sales s
  left join users u on u.id = s.user_id
  left join address a on a.owner_id = u.id and a.address_category = 'USER'
  where s.date_created between ${initialYearDate} and ${finalYearDate}
    and s.status = 'CONFIRMED'
    ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
  group by extract(month from s.date_created)
  order by extract(month from s.date_created)           
    `;

  //venda por status
  const salesStatus = await prisma.$queryRaw<SalesStatusProps[]>`
      select 
        sum(s.value) total,
        case 
          when s.status = 'CONFIRMED' then 'Confimada'
          when s.status = 'PENDING' then 'Pendente'
          when s.status = 'REFUNDED' then 'Cancelada'
          when s.status = 'CANCEL' then 'Cancelada'
        end status
      from sales s
      left join users u on u.id = s.user_id
      left join address a on a.owner_id = u.id and a.address_category = 'USER'
      where s.date_created between ${initialDateConvert} and ${finalDateConvert}
     ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
      group by s.status
  `;

  //novos clientes cadastrados
  const clientsNew = await prisma.$queryRaw<AdminDashboardSalesClientsProps[]>`
      select
      cast(count(u.id) as integer) quantity
    from users u
    join profiles p on p.id = u.profile_id
    left join address a on a.owner_id = u.id and a.address_category = 'USER'
    where cast(u.created_at as date) between ${initialDateConvert} and ${finalDateConvert}
      and u.active = true
      and p.type = 'ADVOGADO'
      ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
  `;

  //quantidade total de clientes
  const clientsTotal = await prisma.$queryRaw<
    AdminDashboardSalesClientsProps[]
  >`
      select
      cast(count(u.id) as integer) quantity
    from users u
    join profiles p on p.id = u.profile_id
    left join address a on a.owner_id = u.id and a.address_category = 'USER'
    where u.active = true
      and p.type = 'ADVOGADO'
      ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
  `;

  // vendas confirmadas por forma de pagamento
  const salesPaymentForm = await prisma.$queryRaw<SalesPaymentFormProps[]>`
    select
    sum(s.value) total,
    case 
      when s.billing_type = 'CREDIT_CARD' then 'Cartão de crédito'
      when s.billing_type = 'DEBIT_CARD' then 'Cartão de débito'
      else 'Outros'
    end payment
  from sales s
  left join users u on u.id = s.user_id
  left join address a on a.owner_id = u.id and a.address_category = 'USER'
  where s.date_created between ${initialDateConvert} and ${finalDateConvert}
    and s.status = 'CONFIRMED'
    ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
  group by s.billing_type
  `;

  const solicitationConsultationStatus = await prisma.$queryRaw<
    SolicitationConsultationStatusProps[]
  >`
    select
    cast(count(pc.id) as integer) quantity,
    case
      when pc.status = 'finished' then 'Finalizada'
      when pc.status = 'open' then 'Aberta'  
      when pc.status = 'paid' then 'Paga'
      when pc.status = 'payment_pending' then 'Pendente Pagamento'
      when pc.status = 'scheduled' then 'Agendada'
      when pc.status = 'in_progress' then 'Em andamento'
      else 'Outros'
    end as status
    from patient_consultations pc 
    left join users u on u.id = pc.user_id
    left join address a on a.owner_id = u.id and a.address_category = 'USER'
    where pc.date_open between ${initialDateConvert} and ${finalDateConvert}
    ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
    group by pc.status
    `;

  const client40DaysSolicitation = await prisma.$queryRaw<
    { quantity: number }[]
  >`
    SELECT cast(count(u.id) as integer) quantity
    FROM users u
    left join address a on a.owner_id = u.id and a.address_category = 'USER'
    JOIN (
      SELECT user_id, MAX(date_open) AS last_consultation
      FROM patient_consultations pc
      where pc.date_open between ${initialDateConvert} and ${finalDateConvert}
      GROUP BY user_id
    ) pc ON u.id = pc.user_id
    WHERE pc.last_consultation <= NOW() - INTERVAL '40 days'
    ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
  `;

  const credisToExpire = await prisma.$queryRaw<{ quantity: number }[]>`
    select cast(count(uc.id) as integer) quantity
    from user_credits uc 
    left join users u on u.id = uc.user_id
    left join address a on a.owner_id = u.id and a.address_category = 'USER'
    where uc.credit_date between ${initialDateConvert} and ${finalDateConvert}
      and uc.expire_date > now()
      and uc.salt  > 0
      ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
  `;

  const medicAtendimentHours = await prisma.$queryRaw<
    AdminDashboardMedicAtendimentHoursProps[]
  >`
    select
      u.name as medic,
      sum(cast(s.atendiment_end as timestamp) - cast(s.atendiment_start as timestamp))::text as duration
    from schedules s
    join users u on u.id = s.medic_id
    left join address a on a.owner_id = u.id and a.address_category = 'USER'
    where cast(s.schedule_date as date) between ${initialDateConvert} and ${finalDateConvert}
    ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
    group by u.name
    order by duration desc
  `;

  const medicRate = await prisma.$queryRaw<AdminDashboardMedicRateProps[]>`
    select
      u.name medic,
      cast(sum(pc.rate) as integer) rate
    from patient_consultations pc 
    join users u on u.id = pc.medic_id 
    left join address a on a.owner_id = u.id and a.address_category = 'USER'
    where pc.date_open between ${initialDateConvert} and ${finalDateConvert}
      and pc.rate > 0
      ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
    group by u.name
    order by rate desc    
  `;

  return {
    totalPending: salesStatus.reduce((acc, item) => {
      return item.status === "Pendente" ? acc + Number(item.total) : acc;
    }, 0),
    totalConfirmed: salesStatus.reduce((acc, item) => {
      return item.status === "Confimada" ? acc + Number(item.total) : acc;
    }, 0),
    newClients: clientsNew[0].quantity ?? 0,
    totalClients: clientsTotal[0].quantity ?? 0,
    invoicingYear: months.map((month) => {
      const item = invoicingYear.find((item) => item.month === month);

      return {
        total: item ? item.total : 0,
        month,
      };
    }),
    salesStatus,
    salesPaymentForm,
    solicitationConsultationStatus,
    client40DaysSolicitation: client40DaysSolicitation[0].quantity ?? 0,
    credisToExpire: credisToExpire[0].quantity ?? 0,
    medicAtendimentHours,
    medicRate,
  };
};
