import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  AdminDashboardSalesClientsProps,
  AdminDashBoardSalesFilterProps,
  InvoicingYearProps,
  SalesStatusProps,
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

  const ufsFilter =
    ufs && ufs.length > 0
      ? `and a.address_state IN (${ufs.map((uf) => `'${uf}'`).join(", ")})`
      : undefined;

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

  const salesStatus = await prisma.$queryRaw<SalesStatusProps[]>`
      select 
        sum(s.value) total,
        s.status 
      from sales s
      left join users u on u.id = s.user_id
      left join address a on a.owner_id = u.id and a.address_category = 'USER'
      where s.date_created between ${initialDateConvert} and ${finalDateConvert}
     ${ufsFilter ? Prisma.sql` ${Prisma.raw(ufsFilter)}` : Prisma.empty}
      group by s.status
  `;

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

  return {
    totalPending: salesStatus.reduce((acc, item) => {
      return item.status === "PENDING" ? acc + Number(item.total) : acc;
    }, 0),
    totalConfirmed: salesStatus.reduce((acc, item) => {
      return item.status === "CONFIRMED" ? acc + Number(item.total) : acc;
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
  };
};
