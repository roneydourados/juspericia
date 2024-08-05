import moment from "moment";
import { formatCNPJ, formatCPF } from "@brazilian-utils/brazilian-utils";
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
  };
};
