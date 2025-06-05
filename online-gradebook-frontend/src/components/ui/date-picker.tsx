import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/shadcn.utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type DateTimePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  name?: string;
  disabled?: boolean;
};

export function DateTimePicker24h({ value, onChange, name, disabled }: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = date ? new Date(date) : new Date();
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(newDate);
      onChange?.(newDate);
    }
  };

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    const currentDate = date || new Date();
    const newDate = new Date(currentDate);

    if (type === 'hour') {
      newDate.setHours(parseInt(value));
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value));
    }

    setDate(newDate);
    onChange?.(newDate);
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'MM/dd/yyyy HH:mm') : <span>MM/DD/YYYY HH:mm</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={date && date.getHours() === hour ? 'default' : 'ghost'}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange('hour', hour.toString())}
                    >
                      {hour.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={date && date.getMinutes() === minute ? 'default' : 'ghost'}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange('minute', minute.toString())}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {name && <input type="hidden" name={name} value={date ? date.toISOString() : ''} />}
    </>
  );
}
