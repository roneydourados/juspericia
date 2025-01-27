import prisma from "@/lib/prisma";
import moment from "moment";
import { months } from "~/utils/FrontConstants";

export interface UserLawyerEstatisticsFilterProps {
  userId: number;
  initialDate: string;
  finalDate: string;
}

interface LawyerQuantityProps {
  quantity: number;
  month: string;
}

interface LawyerSolicitationsStatusProps {
  quantity: number;
  status: string;
}

interface LawyerSolicitationsBenefitTypeProps {
  quantity: number;
  benefit_type: string;
}

interface LawyerSolicitationsReportPropurseProps {
  quantity: number;
  report_purpose: string;
}

interface LawyerSolicitationsTop10FinishedProps {
  id: number;
  patient: string;
  date_open: string;
  date_close: string;
  report_purpose: string;
  benefit_type: string;
  consultation_name: string;
}

export const index = async ({
  userId,
  initialDate,
  finalDate,
}: UserLawyerEstatisticsFilterProps) => {
  try {
    if (!userId || !initialDate || !finalDate) {
      throw createError({
        statusCode: 400,
        message: "Missing required parameters",
      });
    }

    const laywerSolicitations = await prisma.$queryRaw<LawyerQuantityProps[]>`
      select 
        cast(count(pc.id) as integer) as quantity,
        case extract(month from pc.date_open)
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
      from patient_consultations pc
      where pc.user_id = ${userId}
        and pc.date_open between ${new Date(initialDate)} and ${new Date(
      finalDate
    )}
      group by extract(month from pc.date_open)
      order by extract(month from pc.date_open)    
    `;

    const laywerPatientsRegistered = await prisma.$queryRaw<
      LawyerQuantityProps[]
    >`
      select 
        cast(count(p.id) as integer) as quantity,
        case extract(month from p.created_at)
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
      from patients p
      where p.user_id = ${userId}
        and cast(p.created_at as date) between ${new Date(
          initialDate
        )} and ${new Date(finalDate)}
      group by extract(month from p.created_at)
      order by extract(month from p.created_at)    
      `;

    const laywerInvestment = await prisma.$queryRaw<LawyerQuantityProps[]>`
      select 
        cast(sum(s.value) as numeric(18,2)) as quantity,
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
      where s.user_id = ${userId}
        and s.date_created between ${new Date(initialDate)} and ${new Date(
      finalDate
    )}
        and s.status = 'CONFIRMED'
      group by extract(month from s.date_created)
      order by extract(month from s.date_created)    
    `;

    const laywerSolicitationsStatus = await prisma.$queryRaw<
      LawyerSolicitationsStatusProps[]
    >`
        select
          cast(count(pc.id) as integer) quantity,
        case
          when pc.status = 'finished' then 'Concluídas'
          when pc.status = 'scheduled' then 'Agendadas'
          else 'Abertas'
        end as status  
        from patient_consultations pc 
        where pc.user_id = ${userId}
          and pc.status in ('finished', 'open', 'scheduled') 
          and pc.date_open  between ${new Date(initialDate)} and ${new Date(
      finalDate
    )}
        group by pc.status    
      `;

    const laywerSolicitationsBenefitType = await prisma.$queryRaw<
      LawyerSolicitationsBenefitTypeProps[]
    >`
        select
          cast(count(pc.id) as integer) quantity,
          bt."name" benefit_type  
        from patient_consultations pc 
        join benefit_types bt on bt.id = pc.benefit_type_id 
        where pc.user_id = ${userId}
          and pc.date_open between ${new Date(initialDate)} and ${new Date(
      finalDate
    )}
        group by bt."name"      
      `;

    const laywerSolicitationsReportPropurse = await prisma.$queryRaw<
      LawyerSolicitationsReportPropurseProps[]
    >`
      select
        cast(count(pc.id) as integer) quantity,
        rp."name" report_purpose  
      from patient_consultations pc 
      join report_purposes rp on rp.id = pc.report_purpose_id  
      where pc.user_id = ${userId}
        and pc.date_open between ${new Date(initialDate)} and ${new Date(
      finalDate
    )}
      group by rp."name"    
      `;

    const laywerSolicitationsTop10Finished = await prisma.$queryRaw<
      LawyerSolicitationsTop10FinishedProps[]
    >`
      select
        pc.id,
        concat(p."name", ' ', p.surname) patient,
        pc.date_open, 
        pc.date_close,
        rp."name" report_purpose,
        bt."name" benefit_type,
        c.consultation_name 
      from patient_consultations pc 
      join patients p on p.id = pc.patient_id 
      left join report_purposes rp on rp.id = pc.report_purpose_id
      left join benefit_types bt on bt.id = pc.benefit_type_id 
      left join consultations c on c.id = pc.consultation_id 
      where pc.user_id = ${userId}
        and pc.date_open between ${new Date(initialDate)} and ${new Date(
      finalDate
    )}
        and pc.status = 'finished'
      order by pc.id desc
      limit 10
      `;

    const estatistics = {
      laywerSolicitations: months.map((month) => {
        const item = laywerSolicitations.find((item) => item.month === month);

        return {
          quantity: item ? item.quantity : 0,
          month,
        };
      }),
      laywerPatientsRegistered: months.map((month) => {
        const item = laywerPatientsRegistered.find(
          (item) => item.month === month
        );

        return {
          quantity: item ? item.quantity : 0,
          month,
        };
      }),
      laywerInvestment: months.map((month) => {
        const item = laywerInvestment.find((item) => item.month === month);

        return {
          quantity: item ? item.quantity : 0,
          month,
        };
      }),
      laywerSolicitationsStatus,
      laywerSolicitationsBenefitType: laywerSolicitationsBenefitType.map(
        (item) => {
          return {
            quantity: item.quantity,
            benefitType: item.benefit_type,
          };
        }
      ),
      laywerSolicitationsReportPropurse: laywerSolicitationsReportPropurse.map(
        (item) => {
          return {
            quantity: item.quantity,
            reportPurpose: item.report_purpose,
          };
        }
      ),
      laywerSolicitationsTop10Finished: laywerSolicitationsTop10Finished.map(
        (item) => {
          return {
            patient: item.patient,
            dateOpen: item.date_open,
            dateClose: item.date_close,
            reportPurpose: item.report_purpose,
            benefitType: item.benefit_type,
            consultationName: item.consultation_name,
          };
        }
      ),
    };

    return estatistics;
  } catch (error) {
    console.log("Erro ao efetuar consulta estatísticas", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};
