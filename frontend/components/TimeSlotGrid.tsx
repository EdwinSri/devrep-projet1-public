import { useState } from 'react';

import {
  SHORT_DATE_FORMAT,
  TIME_FORMAT,
} from '@/src/dateUtil';
import { TimeSlot } from '@/src/timeSlotsApi';
import { useUser } from '@/src/userUtil';
import {
  Alert,
  Button,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { IconCalendarOff } from '@tabler/icons';

export type TimeSlotGridProps = {
  slots: TimeSlot[];
  bookAppointment: (slot: TimeSlot) => Promise<any>;
};

export default function TimeSlotGrid(props: TimeSlotGridProps) {
  const user = useUser();
  const slots = props.slots;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {
        slots.length
          ?
          <SimpleGrid cols={3} spacing='xs' verticalSpacing='xs'>
            {slots.map(slot => {
              const text = `${SHORT_DATE_FORMAT.format(slot.startDateTime)} `
                + `${TIME_FORMAT.format(slot.startDateTime)} - ${TIME_FORMAT.format(slot.endDateTime)}`;

              return (
                <Button
                  fullWidth
                  variant='light'
                  size='xs'
                  onClick={async () => {
                    setIsLoading(true);
                    await props.bookAppointment(slot);
                    setIsLoading(false);
                  }}
                  key={slot.id}
                  disabled={isLoading}
                  title={text}
                >
                  {text}
                </Button>
              );
            })}
          </SimpleGrid>
          :
          <Alert color='gray' icon={<IconCalendarOff />} styles={{ wrapper: { justifyContent: 'center' }, body: { flex: 'none' } }}>
            <Text c='gray'>Aucun rendez-vous disponible</Text>
          </Alert>
      }
    </>
  );
}
