import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-background p-3", className)}
      classNames={{
        root: classNames?.root,
        months: classNames?.months,
        month: classNames?.month,
        nav: classNames?.nav,
        nav_button: classNames?.nav_button,
        caption: classNames?.caption,
        caption_label: classNames?.caption_label,
        table: classNames?.table,
        head_row: classNames?.head_row,
        head_cell: classNames?.head_cell,
        row: classNames?.row,
        cell: classNames?.cell,
        day: classNames?.day,
        day_selected: classNames?.day_selected,
        day_today: classNames?.day_today,
        day_outside: classNames?.day_outside,
        day_disabled: classNames?.day_disabled,
        day_range_middle: classNames?.day_range_middle,
        day_hidden: classNames?.day_hidden,
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };