
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'Header': typeof import("../components/Header.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'Avatar': typeof import("../components/ui/avatar/index")['Avatar']
    'AvatarFallback': typeof import("../components/ui/avatar/index")['AvatarFallback']
    'AvatarImage': typeof import("../components/ui/avatar/index")['AvatarImage']
    'Badge': typeof import("../components/ui/badge/index")['Badge']
    'Button': typeof import("../components/ui/button/index")['Button']
    'Checkbox': typeof import("../components/ui/checkbox/index")['Checkbox']
    'Dialog': typeof import("../components/ui/dialog/index")['Dialog']
    'DialogClose': typeof import("../components/ui/dialog/index")['DialogClose']
    'DialogContent': typeof import("../components/ui/dialog/index")['DialogContent']
    'DialogDescription': typeof import("../components/ui/dialog/index")['DialogDescription']
    'DialogFooter': typeof import("../components/ui/dialog/index")['DialogFooter']
    'DialogHeader': typeof import("../components/ui/dialog/index")['DialogHeader']
    'DialogScrollContent': typeof import("../components/ui/dialog/index")['DialogScrollContent']
    'DialogTitle': typeof import("../components/ui/dialog/index")['DialogTitle']
    'DialogTrigger': typeof import("../components/ui/dialog/index")['DialogTrigger']
    'FormControl': typeof import("../components/ui/form/index")['FormControl']
    'FormDescription': typeof import("../components/ui/form/index")['FormDescription']
    'FormItem': typeof import("../components/ui/form/index")['FormItem']
    'FormLabel': typeof import("../components/ui/form/index")['FormLabel']
    'FormMessage': typeof import("../components/ui/form/index")['FormMessage']
    'FORMITEMINJECTIONKEY': typeof import("../components/ui/form/index")['FORM_ITEM_INJECTION_KEY']
    'Form': typeof import("../components/ui/form/index")['Form']
    'FormField': typeof import("../components/ui/form/index")['FormField']
    'FormFieldArray': typeof import("../components/ui/form/index")['FormFieldArray']
    'DropdownMenu': typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']
    'DropdownMenuCheckboxItem': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']
    'DropdownMenuContent': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']
    'DropdownMenuGroup': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']
    'DropdownMenuItem': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']
    'DropdownMenuLabel': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']
    'DropdownMenuRadioGroup': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']
    'DropdownMenuRadioItem': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']
    'DropdownMenuSeparator': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']
    'DropdownMenuShortcut': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']
    'DropdownMenuSub': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']
    'DropdownMenuSubContent': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']
    'DropdownMenuSubTrigger': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']
    'DropdownMenuTrigger': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']
    'DropdownMenuPortal': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']
    'Input': typeof import("../components/ui/input/index")['Input']
    'Label': typeof import("../components/ui/label/index")['Label']
    'NavigationMenu': typeof import("../components/ui/navigation-menu/index")['NavigationMenu']
    'NavigationMenuContent': typeof import("../components/ui/navigation-menu/index")['NavigationMenuContent']
    'NavigationMenuIndicator': typeof import("../components/ui/navigation-menu/index")['NavigationMenuIndicator']
    'NavigationMenuItem': typeof import("../components/ui/navigation-menu/index")['NavigationMenuItem']
    'NavigationMenuLink': typeof import("../components/ui/navigation-menu/index")['NavigationMenuLink']
    'NavigationMenuList': typeof import("../components/ui/navigation-menu/index")['NavigationMenuList']
    'NavigationMenuTrigger': typeof import("../components/ui/navigation-menu/index")['NavigationMenuTrigger']
    'NavigationMenuViewport': typeof import("../components/ui/navigation-menu/index")['NavigationMenuViewport']
    'NumberField': typeof import("../components/ui/number-field/index")['NumberField']
    'NumberFieldContent': typeof import("../components/ui/number-field/index")['NumberFieldContent']
    'NumberFieldDecrement': typeof import("../components/ui/number-field/index")['NumberFieldDecrement']
    'NumberFieldIncrement': typeof import("../components/ui/number-field/index")['NumberFieldIncrement']
    'NumberFieldInput': typeof import("../components/ui/number-field/index")['NumberFieldInput']
    'RangeCalendar': typeof import("../components/ui/range-calendar/index")['RangeCalendar']
    'RangeCalendarCell': typeof import("../components/ui/range-calendar/index")['RangeCalendarCell']
    'RangeCalendarCellTrigger': typeof import("../components/ui/range-calendar/index")['RangeCalendarCellTrigger']
    'RangeCalendarGrid': typeof import("../components/ui/range-calendar/index")['RangeCalendarGrid']
    'RangeCalendarGridBody': typeof import("../components/ui/range-calendar/index")['RangeCalendarGridBody']
    'RangeCalendarGridHead': typeof import("../components/ui/range-calendar/index")['RangeCalendarGridHead']
    'RangeCalendarGridRow': typeof import("../components/ui/range-calendar/index")['RangeCalendarGridRow']
    'RangeCalendarHeadCell': typeof import("../components/ui/range-calendar/index")['RangeCalendarHeadCell']
    'RangeCalendarHeader': typeof import("../components/ui/range-calendar/index")['RangeCalendarHeader']
    'RangeCalendarHeading': typeof import("../components/ui/range-calendar/index")['RangeCalendarHeading']
    'RangeCalendarNextButton': typeof import("../components/ui/range-calendar/index")['RangeCalendarNextButton']
    'RangeCalendarPrevButton': typeof import("../components/ui/range-calendar/index")['RangeCalendarPrevButton']
    'ResizableHandle': typeof import("../components/ui/resizable/index")['ResizableHandle']
    'ResizablePanelGroup': typeof import("../components/ui/resizable/index")['ResizablePanelGroup']
    'ResizablePanel': typeof import("../components/ui/resizable/index")['ResizablePanel']
    'ScrollArea': typeof import("../components/ui/scroll-area/index")['ScrollArea']
    'ScrollBar': typeof import("../components/ui/scroll-area/index")['ScrollBar']
    'Select': typeof import("../components/ui/select/index")['Select']
    'SelectContent': typeof import("../components/ui/select/index")['SelectContent']
    'SelectGroup': typeof import("../components/ui/select/index")['SelectGroup']
    'SelectItem': typeof import("../components/ui/select/index")['SelectItem']
    'SelectItemText': typeof import("../components/ui/select/index")['SelectItemText']
    'SelectLabel': typeof import("../components/ui/select/index")['SelectLabel']
    'SelectScrollDownButton': typeof import("../components/ui/select/index")['SelectScrollDownButton']
    'SelectScrollUpButton': typeof import("../components/ui/select/index")['SelectScrollUpButton']
    'SelectSeparator': typeof import("../components/ui/select/index")['SelectSeparator']
    'SelectTrigger': typeof import("../components/ui/select/index")['SelectTrigger']
    'SelectValue': typeof import("../components/ui/select/index")['SelectValue']
    'Separator': typeof import("../components/ui/separator/index")['Separator']
    'Table': typeof import("../components/ui/table/index")['Table']
    'TableBody': typeof import("../components/ui/table/index")['TableBody']
    'TableCaption': typeof import("../components/ui/table/index")['TableCaption']
    'TableCell': typeof import("../components/ui/table/index")['TableCell']
    'TableEmpty': typeof import("../components/ui/table/index")['TableEmpty']
    'TableFooter': typeof import("../components/ui/table/index")['TableFooter']
    'TableHead': typeof import("../components/ui/table/index")['TableHead']
    'TableHeader': typeof import("../components/ui/table/index")['TableHeader']
    'TableRow': typeof import("../components/ui/table/index")['TableRow']
    'Textarea': typeof import("../components/ui/textarea/index")['Textarea']
    'Icon': typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazyHeader': LazyComponent<typeof import("../components/Header.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyAvatar': LazyComponent<typeof import("../components/ui/avatar/index")['Avatar']>
    'LazyAvatarFallback': LazyComponent<typeof import("../components/ui/avatar/index")['AvatarFallback']>
    'LazyAvatarImage': LazyComponent<typeof import("../components/ui/avatar/index")['AvatarImage']>
    'LazyBadge': LazyComponent<typeof import("../components/ui/badge/index")['Badge']>
    'LazyButton': LazyComponent<typeof import("../components/ui/button/index")['Button']>
    'LazyCheckbox': LazyComponent<typeof import("../components/ui/checkbox/index")['Checkbox']>
    'LazyDialog': LazyComponent<typeof import("../components/ui/dialog/index")['Dialog']>
    'LazyDialogClose': LazyComponent<typeof import("../components/ui/dialog/index")['DialogClose']>
    'LazyDialogContent': LazyComponent<typeof import("../components/ui/dialog/index")['DialogContent']>
    'LazyDialogDescription': LazyComponent<typeof import("../components/ui/dialog/index")['DialogDescription']>
    'LazyDialogFooter': LazyComponent<typeof import("../components/ui/dialog/index")['DialogFooter']>
    'LazyDialogHeader': LazyComponent<typeof import("../components/ui/dialog/index")['DialogHeader']>
    'LazyDialogScrollContent': LazyComponent<typeof import("../components/ui/dialog/index")['DialogScrollContent']>
    'LazyDialogTitle': LazyComponent<typeof import("../components/ui/dialog/index")['DialogTitle']>
    'LazyDialogTrigger': LazyComponent<typeof import("../components/ui/dialog/index")['DialogTrigger']>
    'LazyFormControl': LazyComponent<typeof import("../components/ui/form/index")['FormControl']>
    'LazyFormDescription': LazyComponent<typeof import("../components/ui/form/index")['FormDescription']>
    'LazyFormItem': LazyComponent<typeof import("../components/ui/form/index")['FormItem']>
    'LazyFormLabel': LazyComponent<typeof import("../components/ui/form/index")['FormLabel']>
    'LazyFormMessage': LazyComponent<typeof import("../components/ui/form/index")['FormMessage']>
    'LazyFORMITEMINJECTIONKEY': LazyComponent<typeof import("../components/ui/form/index")['FORM_ITEM_INJECTION_KEY']>
    'LazyForm': LazyComponent<typeof import("../components/ui/form/index")['Form']>
    'LazyFormField': LazyComponent<typeof import("../components/ui/form/index")['FormField']>
    'LazyFormFieldArray': LazyComponent<typeof import("../components/ui/form/index")['FormFieldArray']>
    'LazyDropdownMenu': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']>
    'LazyDropdownMenuCheckboxItem': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']>
    'LazyDropdownMenuContent': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']>
    'LazyDropdownMenuGroup': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']>
    'LazyDropdownMenuItem': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']>
    'LazyDropdownMenuLabel': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']>
    'LazyDropdownMenuRadioGroup': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']>
    'LazyDropdownMenuRadioItem': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']>
    'LazyDropdownMenuSeparator': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']>
    'LazyDropdownMenuShortcut': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']>
    'LazyDropdownMenuSub': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']>
    'LazyDropdownMenuSubContent': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']>
    'LazyDropdownMenuSubTrigger': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']>
    'LazyDropdownMenuTrigger': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']>
    'LazyDropdownMenuPortal': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']>
    'LazyInput': LazyComponent<typeof import("../components/ui/input/index")['Input']>
    'LazyLabel': LazyComponent<typeof import("../components/ui/label/index")['Label']>
    'LazyNavigationMenu': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenu']>
    'LazyNavigationMenuContent': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuContent']>
    'LazyNavigationMenuIndicator': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuIndicator']>
    'LazyNavigationMenuItem': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuItem']>
    'LazyNavigationMenuLink': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuLink']>
    'LazyNavigationMenuList': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuList']>
    'LazyNavigationMenuTrigger': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuTrigger']>
    'LazyNavigationMenuViewport': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuViewport']>
    'LazyNumberField': LazyComponent<typeof import("../components/ui/number-field/index")['NumberField']>
    'LazyNumberFieldContent': LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldContent']>
    'LazyNumberFieldDecrement': LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldDecrement']>
    'LazyNumberFieldIncrement': LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldIncrement']>
    'LazyNumberFieldInput': LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldInput']>
    'LazyRangeCalendar': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendar']>
    'LazyRangeCalendarCell': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarCell']>
    'LazyRangeCalendarCellTrigger': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarCellTrigger']>
    'LazyRangeCalendarGrid': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGrid']>
    'LazyRangeCalendarGridBody': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridBody']>
    'LazyRangeCalendarGridHead': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridHead']>
    'LazyRangeCalendarGridRow': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridRow']>
    'LazyRangeCalendarHeadCell': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeadCell']>
    'LazyRangeCalendarHeader': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeader']>
    'LazyRangeCalendarHeading': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeading']>
    'LazyRangeCalendarNextButton': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarNextButton']>
    'LazyRangeCalendarPrevButton': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarPrevButton']>
    'LazyResizableHandle': LazyComponent<typeof import("../components/ui/resizable/index")['ResizableHandle']>
    'LazyResizablePanelGroup': LazyComponent<typeof import("../components/ui/resizable/index")['ResizablePanelGroup']>
    'LazyResizablePanel': LazyComponent<typeof import("../components/ui/resizable/index")['ResizablePanel']>
    'LazyScrollArea': LazyComponent<typeof import("../components/ui/scroll-area/index")['ScrollArea']>
    'LazyScrollBar': LazyComponent<typeof import("../components/ui/scroll-area/index")['ScrollBar']>
    'LazySelect': LazyComponent<typeof import("../components/ui/select/index")['Select']>
    'LazySelectContent': LazyComponent<typeof import("../components/ui/select/index")['SelectContent']>
    'LazySelectGroup': LazyComponent<typeof import("../components/ui/select/index")['SelectGroup']>
    'LazySelectItem': LazyComponent<typeof import("../components/ui/select/index")['SelectItem']>
    'LazySelectItemText': LazyComponent<typeof import("../components/ui/select/index")['SelectItemText']>
    'LazySelectLabel': LazyComponent<typeof import("../components/ui/select/index")['SelectLabel']>
    'LazySelectScrollDownButton': LazyComponent<typeof import("../components/ui/select/index")['SelectScrollDownButton']>
    'LazySelectScrollUpButton': LazyComponent<typeof import("../components/ui/select/index")['SelectScrollUpButton']>
    'LazySelectSeparator': LazyComponent<typeof import("../components/ui/select/index")['SelectSeparator']>
    'LazySelectTrigger': LazyComponent<typeof import("../components/ui/select/index")['SelectTrigger']>
    'LazySelectValue': LazyComponent<typeof import("../components/ui/select/index")['SelectValue']>
    'LazySeparator': LazyComponent<typeof import("../components/ui/separator/index")['Separator']>
    'LazyTable': LazyComponent<typeof import("../components/ui/table/index")['Table']>
    'LazyTableBody': LazyComponent<typeof import("../components/ui/table/index")['TableBody']>
    'LazyTableCaption': LazyComponent<typeof import("../components/ui/table/index")['TableCaption']>
    'LazyTableCell': LazyComponent<typeof import("../components/ui/table/index")['TableCell']>
    'LazyTableEmpty': LazyComponent<typeof import("../components/ui/table/index")['TableEmpty']>
    'LazyTableFooter': LazyComponent<typeof import("../components/ui/table/index")['TableFooter']>
    'LazyTableHead': LazyComponent<typeof import("../components/ui/table/index")['TableHead']>
    'LazyTableHeader': LazyComponent<typeof import("../components/ui/table/index")['TableHeader']>
    'LazyTableRow': LazyComponent<typeof import("../components/ui/table/index")['TableRow']>
    'LazyTextarea': LazyComponent<typeof import("../components/ui/textarea/index")['Textarea']>
    'LazyIcon': LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const Header: typeof import("../components/Header.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const Avatar: typeof import("../components/ui/avatar/index")['Avatar']
export const AvatarFallback: typeof import("../components/ui/avatar/index")['AvatarFallback']
export const AvatarImage: typeof import("../components/ui/avatar/index")['AvatarImage']
export const Badge: typeof import("../components/ui/badge/index")['Badge']
export const Button: typeof import("../components/ui/button/index")['Button']
export const Checkbox: typeof import("../components/ui/checkbox/index")['Checkbox']
export const Dialog: typeof import("../components/ui/dialog/index")['Dialog']
export const DialogClose: typeof import("../components/ui/dialog/index")['DialogClose']
export const DialogContent: typeof import("../components/ui/dialog/index")['DialogContent']
export const DialogDescription: typeof import("../components/ui/dialog/index")['DialogDescription']
export const DialogFooter: typeof import("../components/ui/dialog/index")['DialogFooter']
export const DialogHeader: typeof import("../components/ui/dialog/index")['DialogHeader']
export const DialogScrollContent: typeof import("../components/ui/dialog/index")['DialogScrollContent']
export const DialogTitle: typeof import("../components/ui/dialog/index")['DialogTitle']
export const DialogTrigger: typeof import("../components/ui/dialog/index")['DialogTrigger']
export const FormControl: typeof import("../components/ui/form/index")['FormControl']
export const FormDescription: typeof import("../components/ui/form/index")['FormDescription']
export const FormItem: typeof import("../components/ui/form/index")['FormItem']
export const FormLabel: typeof import("../components/ui/form/index")['FormLabel']
export const FormMessage: typeof import("../components/ui/form/index")['FormMessage']
export const FORMITEMINJECTIONKEY: typeof import("../components/ui/form/index")['FORM_ITEM_INJECTION_KEY']
export const Form: typeof import("../components/ui/form/index")['Form']
export const FormField: typeof import("../components/ui/form/index")['FormField']
export const FormFieldArray: typeof import("../components/ui/form/index")['FormFieldArray']
export const DropdownMenu: typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']
export const DropdownMenuCheckboxItem: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']
export const DropdownMenuContent: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']
export const DropdownMenuGroup: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']
export const DropdownMenuItem: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']
export const DropdownMenuLabel: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']
export const DropdownMenuRadioGroup: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']
export const DropdownMenuRadioItem: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']
export const DropdownMenuSeparator: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']
export const DropdownMenuShortcut: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']
export const DropdownMenuSub: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']
export const DropdownMenuSubContent: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']
export const DropdownMenuSubTrigger: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']
export const DropdownMenuTrigger: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']
export const DropdownMenuPortal: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']
export const Input: typeof import("../components/ui/input/index")['Input']
export const Label: typeof import("../components/ui/label/index")['Label']
export const NavigationMenu: typeof import("../components/ui/navigation-menu/index")['NavigationMenu']
export const NavigationMenuContent: typeof import("../components/ui/navigation-menu/index")['NavigationMenuContent']
export const NavigationMenuIndicator: typeof import("../components/ui/navigation-menu/index")['NavigationMenuIndicator']
export const NavigationMenuItem: typeof import("../components/ui/navigation-menu/index")['NavigationMenuItem']
export const NavigationMenuLink: typeof import("../components/ui/navigation-menu/index")['NavigationMenuLink']
export const NavigationMenuList: typeof import("../components/ui/navigation-menu/index")['NavigationMenuList']
export const NavigationMenuTrigger: typeof import("../components/ui/navigation-menu/index")['NavigationMenuTrigger']
export const NavigationMenuViewport: typeof import("../components/ui/navigation-menu/index")['NavigationMenuViewport']
export const NumberField: typeof import("../components/ui/number-field/index")['NumberField']
export const NumberFieldContent: typeof import("../components/ui/number-field/index")['NumberFieldContent']
export const NumberFieldDecrement: typeof import("../components/ui/number-field/index")['NumberFieldDecrement']
export const NumberFieldIncrement: typeof import("../components/ui/number-field/index")['NumberFieldIncrement']
export const NumberFieldInput: typeof import("../components/ui/number-field/index")['NumberFieldInput']
export const RangeCalendar: typeof import("../components/ui/range-calendar/index")['RangeCalendar']
export const RangeCalendarCell: typeof import("../components/ui/range-calendar/index")['RangeCalendarCell']
export const RangeCalendarCellTrigger: typeof import("../components/ui/range-calendar/index")['RangeCalendarCellTrigger']
export const RangeCalendarGrid: typeof import("../components/ui/range-calendar/index")['RangeCalendarGrid']
export const RangeCalendarGridBody: typeof import("../components/ui/range-calendar/index")['RangeCalendarGridBody']
export const RangeCalendarGridHead: typeof import("../components/ui/range-calendar/index")['RangeCalendarGridHead']
export const RangeCalendarGridRow: typeof import("../components/ui/range-calendar/index")['RangeCalendarGridRow']
export const RangeCalendarHeadCell: typeof import("../components/ui/range-calendar/index")['RangeCalendarHeadCell']
export const RangeCalendarHeader: typeof import("../components/ui/range-calendar/index")['RangeCalendarHeader']
export const RangeCalendarHeading: typeof import("../components/ui/range-calendar/index")['RangeCalendarHeading']
export const RangeCalendarNextButton: typeof import("../components/ui/range-calendar/index")['RangeCalendarNextButton']
export const RangeCalendarPrevButton: typeof import("../components/ui/range-calendar/index")['RangeCalendarPrevButton']
export const ResizableHandle: typeof import("../components/ui/resizable/index")['ResizableHandle']
export const ResizablePanelGroup: typeof import("../components/ui/resizable/index")['ResizablePanelGroup']
export const ResizablePanel: typeof import("../components/ui/resizable/index")['ResizablePanel']
export const ScrollArea: typeof import("../components/ui/scroll-area/index")['ScrollArea']
export const ScrollBar: typeof import("../components/ui/scroll-area/index")['ScrollBar']
export const Select: typeof import("../components/ui/select/index")['Select']
export const SelectContent: typeof import("../components/ui/select/index")['SelectContent']
export const SelectGroup: typeof import("../components/ui/select/index")['SelectGroup']
export const SelectItem: typeof import("../components/ui/select/index")['SelectItem']
export const SelectItemText: typeof import("../components/ui/select/index")['SelectItemText']
export const SelectLabel: typeof import("../components/ui/select/index")['SelectLabel']
export const SelectScrollDownButton: typeof import("../components/ui/select/index")['SelectScrollDownButton']
export const SelectScrollUpButton: typeof import("../components/ui/select/index")['SelectScrollUpButton']
export const SelectSeparator: typeof import("../components/ui/select/index")['SelectSeparator']
export const SelectTrigger: typeof import("../components/ui/select/index")['SelectTrigger']
export const SelectValue: typeof import("../components/ui/select/index")['SelectValue']
export const Separator: typeof import("../components/ui/separator/index")['Separator']
export const Table: typeof import("../components/ui/table/index")['Table']
export const TableBody: typeof import("../components/ui/table/index")['TableBody']
export const TableCaption: typeof import("../components/ui/table/index")['TableCaption']
export const TableCell: typeof import("../components/ui/table/index")['TableCell']
export const TableEmpty: typeof import("../components/ui/table/index")['TableEmpty']
export const TableFooter: typeof import("../components/ui/table/index")['TableFooter']
export const TableHead: typeof import("../components/ui/table/index")['TableHead']
export const TableHeader: typeof import("../components/ui/table/index")['TableHeader']
export const TableRow: typeof import("../components/ui/table/index")['TableRow']
export const Textarea: typeof import("../components/ui/textarea/index")['Textarea']
export const Icon: typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyHeader: LazyComponent<typeof import("../components/Header.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyAvatar: LazyComponent<typeof import("../components/ui/avatar/index")['Avatar']>
export const LazyAvatarFallback: LazyComponent<typeof import("../components/ui/avatar/index")['AvatarFallback']>
export const LazyAvatarImage: LazyComponent<typeof import("../components/ui/avatar/index")['AvatarImage']>
export const LazyBadge: LazyComponent<typeof import("../components/ui/badge/index")['Badge']>
export const LazyButton: LazyComponent<typeof import("../components/ui/button/index")['Button']>
export const LazyCheckbox: LazyComponent<typeof import("../components/ui/checkbox/index")['Checkbox']>
export const LazyDialog: LazyComponent<typeof import("../components/ui/dialog/index")['Dialog']>
export const LazyDialogClose: LazyComponent<typeof import("../components/ui/dialog/index")['DialogClose']>
export const LazyDialogContent: LazyComponent<typeof import("../components/ui/dialog/index")['DialogContent']>
export const LazyDialogDescription: LazyComponent<typeof import("../components/ui/dialog/index")['DialogDescription']>
export const LazyDialogFooter: LazyComponent<typeof import("../components/ui/dialog/index")['DialogFooter']>
export const LazyDialogHeader: LazyComponent<typeof import("../components/ui/dialog/index")['DialogHeader']>
export const LazyDialogScrollContent: LazyComponent<typeof import("../components/ui/dialog/index")['DialogScrollContent']>
export const LazyDialogTitle: LazyComponent<typeof import("../components/ui/dialog/index")['DialogTitle']>
export const LazyDialogTrigger: LazyComponent<typeof import("../components/ui/dialog/index")['DialogTrigger']>
export const LazyFormControl: LazyComponent<typeof import("../components/ui/form/index")['FormControl']>
export const LazyFormDescription: LazyComponent<typeof import("../components/ui/form/index")['FormDescription']>
export const LazyFormItem: LazyComponent<typeof import("../components/ui/form/index")['FormItem']>
export const LazyFormLabel: LazyComponent<typeof import("../components/ui/form/index")['FormLabel']>
export const LazyFormMessage: LazyComponent<typeof import("../components/ui/form/index")['FormMessage']>
export const LazyFORMITEMINJECTIONKEY: LazyComponent<typeof import("../components/ui/form/index")['FORM_ITEM_INJECTION_KEY']>
export const LazyForm: LazyComponent<typeof import("../components/ui/form/index")['Form']>
export const LazyFormField: LazyComponent<typeof import("../components/ui/form/index")['FormField']>
export const LazyFormFieldArray: LazyComponent<typeof import("../components/ui/form/index")['FormFieldArray']>
export const LazyDropdownMenu: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']>
export const LazyDropdownMenuCheckboxItem: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']>
export const LazyDropdownMenuContent: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']>
export const LazyDropdownMenuGroup: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']>
export const LazyDropdownMenuItem: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']>
export const LazyDropdownMenuLabel: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']>
export const LazyDropdownMenuRadioGroup: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']>
export const LazyDropdownMenuRadioItem: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']>
export const LazyDropdownMenuSeparator: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']>
export const LazyDropdownMenuShortcut: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']>
export const LazyDropdownMenuSub: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']>
export const LazyDropdownMenuSubContent: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']>
export const LazyDropdownMenuSubTrigger: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']>
export const LazyDropdownMenuTrigger: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']>
export const LazyDropdownMenuPortal: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']>
export const LazyInput: LazyComponent<typeof import("../components/ui/input/index")['Input']>
export const LazyLabel: LazyComponent<typeof import("../components/ui/label/index")['Label']>
export const LazyNavigationMenu: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenu']>
export const LazyNavigationMenuContent: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuContent']>
export const LazyNavigationMenuIndicator: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuIndicator']>
export const LazyNavigationMenuItem: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuItem']>
export const LazyNavigationMenuLink: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuLink']>
export const LazyNavigationMenuList: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuList']>
export const LazyNavigationMenuTrigger: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuTrigger']>
export const LazyNavigationMenuViewport: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuViewport']>
export const LazyNumberField: LazyComponent<typeof import("../components/ui/number-field/index")['NumberField']>
export const LazyNumberFieldContent: LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldContent']>
export const LazyNumberFieldDecrement: LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldDecrement']>
export const LazyNumberFieldIncrement: LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldIncrement']>
export const LazyNumberFieldInput: LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldInput']>
export const LazyRangeCalendar: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendar']>
export const LazyRangeCalendarCell: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarCell']>
export const LazyRangeCalendarCellTrigger: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarCellTrigger']>
export const LazyRangeCalendarGrid: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGrid']>
export const LazyRangeCalendarGridBody: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridBody']>
export const LazyRangeCalendarGridHead: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridHead']>
export const LazyRangeCalendarGridRow: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridRow']>
export const LazyRangeCalendarHeadCell: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeadCell']>
export const LazyRangeCalendarHeader: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeader']>
export const LazyRangeCalendarHeading: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeading']>
export const LazyRangeCalendarNextButton: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarNextButton']>
export const LazyRangeCalendarPrevButton: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarPrevButton']>
export const LazyResizableHandle: LazyComponent<typeof import("../components/ui/resizable/index")['ResizableHandle']>
export const LazyResizablePanelGroup: LazyComponent<typeof import("../components/ui/resizable/index")['ResizablePanelGroup']>
export const LazyResizablePanel: LazyComponent<typeof import("../components/ui/resizable/index")['ResizablePanel']>
export const LazyScrollArea: LazyComponent<typeof import("../components/ui/scroll-area/index")['ScrollArea']>
export const LazyScrollBar: LazyComponent<typeof import("../components/ui/scroll-area/index")['ScrollBar']>
export const LazySelect: LazyComponent<typeof import("../components/ui/select/index")['Select']>
export const LazySelectContent: LazyComponent<typeof import("../components/ui/select/index")['SelectContent']>
export const LazySelectGroup: LazyComponent<typeof import("../components/ui/select/index")['SelectGroup']>
export const LazySelectItem: LazyComponent<typeof import("../components/ui/select/index")['SelectItem']>
export const LazySelectItemText: LazyComponent<typeof import("../components/ui/select/index")['SelectItemText']>
export const LazySelectLabel: LazyComponent<typeof import("../components/ui/select/index")['SelectLabel']>
export const LazySelectScrollDownButton: LazyComponent<typeof import("../components/ui/select/index")['SelectScrollDownButton']>
export const LazySelectScrollUpButton: LazyComponent<typeof import("../components/ui/select/index")['SelectScrollUpButton']>
export const LazySelectSeparator: LazyComponent<typeof import("../components/ui/select/index")['SelectSeparator']>
export const LazySelectTrigger: LazyComponent<typeof import("../components/ui/select/index")['SelectTrigger']>
export const LazySelectValue: LazyComponent<typeof import("../components/ui/select/index")['SelectValue']>
export const LazySeparator: LazyComponent<typeof import("../components/ui/separator/index")['Separator']>
export const LazyTable: LazyComponent<typeof import("../components/ui/table/index")['Table']>
export const LazyTableBody: LazyComponent<typeof import("../components/ui/table/index")['TableBody']>
export const LazyTableCaption: LazyComponent<typeof import("../components/ui/table/index")['TableCaption']>
export const LazyTableCell: LazyComponent<typeof import("../components/ui/table/index")['TableCell']>
export const LazyTableEmpty: LazyComponent<typeof import("../components/ui/table/index")['TableEmpty']>
export const LazyTableFooter: LazyComponent<typeof import("../components/ui/table/index")['TableFooter']>
export const LazyTableHead: LazyComponent<typeof import("../components/ui/table/index")['TableHead']>
export const LazyTableHeader: LazyComponent<typeof import("../components/ui/table/index")['TableHeader']>
export const LazyTableRow: LazyComponent<typeof import("../components/ui/table/index")['TableRow']>
export const LazyTextarea: LazyComponent<typeof import("../components/ui/textarea/index")['Textarea']>
export const LazyIcon: LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
