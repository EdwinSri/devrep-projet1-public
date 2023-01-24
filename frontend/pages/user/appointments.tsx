import { useState } from 'react';

import Layout from '@/components/Layout';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import { useSWRCustom } from '@/src/api';
import {
  LONG_DATE_FORMAT,
  LONG_DATE_TIME_FORMAT,
  TIME_FORMAT,
} from '@/src/dateUtil';
import * as timeSlotsApi from '@/src/timeSlotsApi';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCalendar,
  IconCalendarOff,
  IconClock,
  IconClockEdit,
  IconInfoCircle,
} from '@tabler/icons';

type AppointmentCardProps = {
  slot: timeSlotsApi.TimeSlot;
};

type RescheduleAppointmentModalProps = {
  slot: timeSlotsApi.TimeSlot;
  opened: boolean;
  setOpened: (_: boolean) => void;
};

function RescheduleAppointmentModal(props: RescheduleAppointmentModalProps) {
  const slot = props.slot;

  const freeSlots = useSWRCustom(timeSlotsApi.getProFreeSlots, [slot.professionalId]);

  const bookAppointment = async (newSlot: timeSlotsApi.TimeSlot) => {
    let cannotBook = false;
    cannotBook = true;
    if (cannotBook) {
      showNotification({ color: 'red', message: 'Contactez le professionnel de santé pour prendre rendez-vous.' });
      return;
    }

    try {
      await timeSlotsApi.rescheduleUserAppointment({
        oldTimeSlotId: slot.id,
        newTimeSlotId: newSlot.id,
      });
      showNotification({ color: 'green', message: 'Rendez-vous déplacé' });
      props.setOpened(false);
    } catch (e) {
      console.log(e);
      showNotification({ color: 'red', message: 'Une erreur est survenue lors du déplacement du rendez-vous.' });
    }
  };

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      title={`Déplacer le rendez-vous du ${LONG_DATE_TIME_FORMAT.format(slot.startDateTime)}`}
      size='lg'
    >
      <Box my='xl'>
        {(() => {
          if (freeSlots.error) {
            return <Alert color='red' icon={<IconAlertCircle />}>Une erreur est survenue lors du chargement des créneaux.</Alert>
          }

          if (freeSlots.data == null) {
            return <Center><Loader /></Center>
          }

          return (
            <TimeSlotGrid
              slots={freeSlots.data}
              bookAppointment={bookAppointment}
            />
          );
        })()}
      </Box>
    </Modal>
  );
}

function AppointmentCard(props: AppointmentCardProps) {
  const theme = useMantineTheme();
  const slot = props.slot;

  const { data: pro } = useSWRCustom(timeSlotsApi.getProInfo, [slot.professionalId]);

  const [cancelling, setCancelling] = useState(false);
  const [rescheduleModalOpened, setRescheduleModalOpened] = useState(false);

  const onCancel = () => {
    const date = LONG_DATE_TIME_FORMAT.format(slot.startDateTime);
    openConfirmModal({
      title: `Annuler le rendez-vous du ${date} ?`,
      labels: { confirm: 'Oui, annuler', cancel: 'Non' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setCancelling(true);
        try {
          await timeSlotsApi.cancelUserAppointment(slot.id);
          showNotification({ color: 'green', message: 'Rendez-vous annulé.' });
        } catch (e) {
          console.error(e);
          showNotification({ color: 'red', message: `Une erreur est survenue lors de la tentative d'annulation du RDV du ${date}.` });
          setCancelling(false);
        }
      }
    });
  };

  return (
    <>
      <Card p="lg" radius="md" withBorder mb='xl'>
        <Card.Section withBorder inheritPadding py={5} mb='md' sx={{ backgroundColor: theme.colors.blue, color: 'white' }}>
          <Text span weight={500}>
            <IconCalendar style={{ position: 'relative', top: '3px' }} size={18} /> {LONG_DATE_FORMAT.format(slot.startDateTime)}
          </Text>
          <Text span weight={500} ml='md'>
            <IconClock style={{ position: 'relative', top: '3px' }} size={18} /> {TIME_FORMAT.format(slot.startDateTime)}
          </Text>
        </Card.Section>

        <LoadingOverlay visible={cancelling} />

        <Group>
          <Text weight={500}>{pro ? `${pro.firstName} ${pro.lastName}` : `Pro ID ${slot.professionalId}`}</Text>
          <Badge color='cyan' variant='light'>
            {pro?.profession || 'Inconnu'}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          {pro?.address || 'Adresse inconnue'}
        </Text>

        <Card.Section inheritPadding py='md'>
          <Group grow>
            <Button
              variant='light'
              color='red'
              leftIcon={<IconCalendarOff size={20} />}
              onClick={onCancel}
              disabled={cancelling}
            >
              Annuler
            </Button>

            <Button
              variant='light'
              color='orange'
              leftIcon={<IconClockEdit size={20} />}
              onClick={() => setRescheduleModalOpened(true)}
              disabled={cancelling}
            >
              Déplacer
            </Button>
          </Group>
        </Card.Section>
      </Card>

      <RescheduleAppointmentModal
        slot={slot}
        opened={rescheduleModalOpened}
        setOpened={setRescheduleModalOpened}
      />
    </>
  );
}

export default function UserAppointments() {
  const appointments = timeSlotsApi.useAppointments();

  return (
    <Layout title='Mes rendez-vous'>
      {(() => {
        if (appointments.error != null) {
          return (
            <Alert color='red' icon={<IconAlertTriangle />}>Une erreur est survenue lors du chargement des rendez-vous.</Alert>
          );
        }

        if (appointments.data == null) {
          return <Loader />;
        }

        if (appointments.data.length === 0) {
          return (
            <Alert icon={<IconInfoCircle />}>Vous n'avez aucun rendez-vous.</Alert>
          );
        }

        return (
          <>
            <Alert mb='xl' icon={<IconInfoCircle />}>Si vous ne pouvez pas honorer un rendez-vous, pensez à l'annuler.</Alert>

            {appointments.data.map(slot => <AppointmentCard key={slot.id} slot={slot} />)}
          </>
        );
      })()}
    </Layout>
  )
}
