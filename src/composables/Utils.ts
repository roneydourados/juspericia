import moment from "moment";
import { formatCNPJ, formatCPF } from "@brazilian-utils/brazilian-utils";
import { useDisplay } from "vuetify";
type CompactDisplayType = "short" | "long" | undefined;

export const useUtils = () => {
  const amountFormated = (
    value: number,
    isCurrencyStyle: boolean,
    compactDisplay: CompactDisplayType = undefined
  ) => {
    return new Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: isCurrencyStyle ? "currency" : undefined,
      compactDisplay,
      notation: compactDisplay ? "compact" : undefined,
    }).format(value);
  };

  const cardInvoices = () => {
    let momentDate = moment();
    let invoices = [] as String[];

    for (let i = 1; i <= 48; i++) {
      invoices.push(
        `${moment(momentDate).format("MM")}/${moment(momentDate).format(
          "yyyy"
        )}`
      );

      momentDate = moment(momentDate).add(1, "months");
    }

    return invoices;
  };

  const numberOnly = (text: string) => {
    return !isNaN(Number(text));
  };

  const formatDate = (date?: string) => {
    if (date) {
      return moment(date.substring(0, 10)).format("DD/MM/yyyy");
    }

    return moment().format("DD/MM/yyyy");
  };

  const extenseDate = (date?: string) => {
    let data = new Date();

    if (date) {
      data = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formato = new Intl.DateTimeFormat("pt-BR", options);

    return formato.format(data);
  };

  const formatTelephoneNumber = (telephoneNumber: string) => {
    return telephoneNumber.replace(
      /^([0-9]{2})([0-9]{4,5})([0-9]{4})$/,
      "($1) $2-$3"
    );
  };

  const decimalFormated = (value: number, numberPlaces: number) => {
    return new Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      minimumFractionDigits: numberPlaces,
    }).format(value);
  };

  const age = (dateBirth: string) => {
    if (!dateBirth) {
      return 0;
    }

    const currentYear = moment().year();
    const birthYear = moment(dateBirth).year();

    const currentMonth = moment().month();
    const birthMonth = moment(dateBirth).month();

    if (birthMonth === currentMonth && birthYear === currentYear) {
      return `${moment().diff(dateBirth, "days")} ${
        moment().diff(dateBirth, "days") > 1 ? "dias" : "dia"
      }`;
    }

    if (birthYear === currentYear) {
      return `${moment().diff(dateBirth, "months")} ${
        moment().diff(dateBirth, "months") > 1 ? "meses" : "mês"
      }`;
    }

    return `${moment().diff(dateBirth, "years")} ${
      moment().diff(dateBirth, "years") > 1 ? "anos" : "ano"
    }`;
  };

  const getInitials = (name: string) => {
    if (!name) {
      return "";
    }

    const hasSpace = !name.includes(" ") ? name.includes(" ") : name;

    const formattedName = hasSpace ? name : `${name} `;
    const [firstName, lastName] = formattedName.split(" ");

    return `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}`;
  };

  const calculateEndTime = (
    initialHour: string,
    initialDate: string,
    intervalMinutes: number
  ) => {
    if (!initialHour || !initialDate || !intervalMinutes) {
      return "Aguardando agenda...";
    }

    const endDate = moment(`${initialDate} ${initialHour}`)
      .add(intervalMinutes, "minutes")
      .format("HH:mm");

    return endDate;
  };

  const calculateEventInterval = (
    initialHour: string,
    initialDate: string,
    intervalMinutes: number
  ) => {
    if (!initialHour || !initialDate || !intervalMinutes) {
      return {
        start: "",
        end: "",
      };
    }

    const start = `${moment(`${initialDate} ${initialHour}`).format(
      "YYYY-MM-DD HH:mm:ss"
    )}`;

    const end = `${moment(`${initialDate} ${initialHour}`)
      .add(intervalMinutes, "minutes")
      .format("YYYY-MM-DD HH:mm:ss")}`;

    return {
      start,
      end,
    };
  };

  const validateDateInterval = (initialDate: string, finalDate: string) => {
    return moment(initialDate).isAfter(finalDate);
  };

  const difDays = (initialDate: string, finalDate: string) => {
    const initDate = moment(initialDate);
    const endDate = moment(finalDate);

    return endDate.diff(initDate, "days");
  };

  const formatCPFOrCNPJ = (value: string) => {
    if (value.length === 11) {
      return formatCPF(value);
    }

    return formatCNPJ(value);
  };

  const stringToHandlePDF = (value: string) => {
    // Criar um iframe temporário
    const iframe = document.createElement("iframe");

    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    // Escrever o conteúdo HTML no iframe e chamar a impressão
    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(value);
      iframe.contentDocument.close();
    }

    if (iframe.contentWindow) {
      // Remover após a impressão
      iframe.contentWindow.onafterprint = () =>
        document.body.removeChild(iframe);
      iframe.contentWindow.print();
    }
  };

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getSolicitationsFilters = () => {
    const filters = localStorage.getItem("solicitationsFilters");

    if (filters) {
      return JSON.parse(filters) as SolicitationConsultationFilterProps;
    }

    return {
      initialDateSolicitation: moment()
        .subtract(3, "month")
        .format("YYYY-MM-DD"),
      finalDateSolicitation: moment().endOf("month").format("YYYY-MM-DD"),
      status: "open",
    };
  };

  const setSolicitationsFilters = (
    filter: SolicitationConsultationFilterProps
  ) => {
    localStorage.setItem("solicitationsFilters", JSON.stringify(filter));
  };

  const solicitationStatusName = (status: string) => {
    switch (status.trim().toLowerCase()) {
      case "open":
        return "Pendente";
      case "in_progress":
        return "Em andamento";
      case "scheduled":
        return "Agendada";
      case "finished":
        return "Finalizada";
      case "canceled":
        return "Cancelada";
      case "paid":
        return "Pago";
      case "payment_pending":
        return "Pagamento pendente";
      default:
        return "Pendente";
    }
  };

  const solicitationStatusColor = (status: string) => {
    switch (status.trim().toLowerCase()) {
      case "open":
        return "#3F51B5";
      case "in_progress":
        return "#2196F3";
      case "scheduled":
        return "#00838F";
      case "finished":
        return "#43A047";
      case "canceled":
        return "#F44336";
      case "paid":
        return "#26A69A";
      case "payment_pending":
        return "#EF6C00";
      default:
        return "#9C27B0";
    }
  };

  const formatDateExtenso = (date: Date) => {
    const diasDaSemana = [
      "Domingo",
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
      "Sábado",
    ];

    const mesesDoAno = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const diaDaSemana = diasDaSemana[date.getDay()];
    const dia = date.getDate();
    const mes = mesesDoAno[date.getMonth()];
    const ano = date.getFullYear();

    return `${diaDaSemana}, ${dia} de ${mes} de ${ano}`;
  };

  const whatsappUrl = (phone: string, message: string) => {
    const { mobile } = useDisplay();
    let url = "";

    if (mobile) {
      url = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    } else {
      url = `https://web.whatsapp.com/send?phone=${phone}&text=${message}`;
    }

    return url;
  };

  return {
    amountFormated,
    cardInvoices,
    numberOnly,
    formatDate,
    formatTelephoneNumber,
    decimalFormated,
    age,
    getInitials,
    calculateEndTime,
    calculateEventInterval,
    validateDateInterval,
    difDays,
    extenseDate,
    formatCPFOrCNPJ,
    stringToHandlePDF,
    generateRandomColor,
    getSolicitationsFilters,
    setSolicitationsFilters,
    solicitationStatusName,
    solicitationStatusColor,
    formatDateExtenso,
    whatsappUrl,
  };
};
