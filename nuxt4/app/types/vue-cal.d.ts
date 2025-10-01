declare module "vue-cal" {
  import { DefineComponent } from "vue";

  export interface VueCalEvent {
    id?: string | number;
    start: Date | string;
    end: Date | string;
    title: string;
    content?: string;
    class?: string;
    background?: boolean;
    allDay?: boolean;
    deletable?: boolean;
    resizable?: boolean;
    draggable?: boolean;
    [key: string]: any;
  }

  export interface VueCalView {
    id: string;
    label: string;
    enabled: boolean;
  }

  export interface VueCalProps {
    activeView?: string;
    cellClickHold?: boolean;
    cellContextmenu?: boolean;
    clickToNavigate?: boolean;
    dblclickToNavigate?: boolean;
    defaultView?: string;
    disableDatePrototypes?: boolean;
    disableViews?: string[];
    dragToCreateEvent?: boolean;
    dragToCreateThreshold?: number;
    editableEvents?: boolean;
    events?: VueCalEvent[];
    eventsCountOnYearView?: boolean;
    eventsOnMonthView?: string | boolean;
    hideBody?: boolean;
    hideTitleBar?: boolean;
    hideViewSelector?: boolean;
    hideWeekdays?: string[];
    hideWeekends?: boolean;
    locale?: string;
    maxDate?: string | Date;
    minDate?: string | Date;
    minEventWidth?: number;
    minSplitWidth?: number;
    onEventClick?: (event: VueCalEvent, e: Event) => void;
    onEventCreate?: (
      event: VueCalEvent,
      deleteEventFunction: () => void
    ) => void;
    onEventDelete?: (event: VueCalEvent) => void;
    onEventDblclick?: (event: VueCalEvent, e: Event) => void;
    onEventDrag?: (event: VueCalEvent, deleteEventFunction: () => void) => void;
    onEventDrop?: (event: VueCalEvent, deleteEventFunction: () => void) => void;
    onEventDurationChange?: (event: VueCalEvent) => void;
    onEventFocus?: (event: VueCalEvent, e: Event) => void;
    onEventMouseEnter?: (event: VueCalEvent, e: Event) => void;
    onEventMouseLeave?: (event: VueCalEvent, e: Event) => void;
    onEventResize?: (event: VueCalEvent) => void;
    onEventTitleChange?: (event: VueCalEvent) => void;
    onReady?: () => void;
    onViewChange?: (view: VueCalView, events: VueCalEvent[]) => void;
    overlapsPerTimeStep?: number;
    resizeX?: boolean;
    selectedDate?: string | Date;
    showAllDayEvents?: string | boolean;
    showTimeInCells?: boolean;
    showWeekNumbers?: boolean | string;
    snapToTime?: number;
    specialHours?: object;
    splitDays?: number[];
    startWeekOnSunday?: boolean;
    stickySplitLabels?: boolean;
    time?: boolean;
    timeFormat?: string;
    timeCellHeight?: number;
    timeFrom?: number;
    timeStep?: number;
    timeTo?: number;
    todayButton?: boolean;
    transitions?: boolean;
    twelveHour?: boolean;
    watchRealTime?: boolean;
    xsmall?: boolean;
    [key: string]: any;
  }

  const VueCal: DefineComponent<VueCalProps>;
  export default VueCal;
}
