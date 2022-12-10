import { useState } from 'react';

import Layout from '@/components/Layout';
import { useSWRCustom } from '@/src/api';
import {
  addMinutes,
  LONG_DATE_FORMAT,
  LONG_DATE_TIME_FORMAT,
  TIME_FORMAT,
  toLocalDateTimeString,
} from '@/src/dateUtil';
import {
  addProSlot,
  deleteProSlot,
  getProInfo,
  TimeSlot,
  useProSlots,
} from '@/src/timeSlotsApi';
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Grid,
  Group,
  Loader,
  NumberInput,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCalendar,
  IconCalendarPlus,
  IconClock,
  IconInfoCircle,
  IconTrash,
  IconUser,
} from '@tabler/icons';

type ProSlotCardProps = {
  slot: TimeSlot;
};

function ProSlotCard(props: ProSlotCardProps) {
  const theme = useMantineTheme();
  const slot = props.slot;

  const { data: patient } = useSWRCustom(getProInfo, slot.patientId ? [slot.patientId] : null);

  const [deleting, setDeleting] = useState(false);

  const onDelete = () => {
    const date = LONG_DATE_TIME_FORMAT.format(slot.startDateTime);
    openConfirmModal({
      title: `Supprimer le créneau du ${date} ?`,
      labels: { confirm: 'Oui, supprimer', cancel: 'Non' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setDeleting(true);
        try {
          await deleteProSlot(slot.id);
          showNotification({ color: 'green', message: 'Créneau supprimé.' });
        } catch (e) {
          console.error(e);
          showNotification({ color: 'red', message: `Une erreur est survenue lors de la tentative de suppression du créneau du ${date}.` });
        } finally {
          setDeleting(false);
        }
      }
    });
  };

  return (
    <>
      <Card
        p='lg'
        radius='md'
        mb='xs'
      >
        <Card.Section
          withBorder
          inheritPadding
          py={8}
          sx={{ backgroundColor: slot.patientId != null ? theme.colors.blue : theme.colors.green, color: 'white' }}
        >
          <Group position='apart'>
            <div>
              <Text span weight={500} mr='md'>
                <IconCalendar style={{ position: 'relative', top: '3px' }} size={18} /> {LONG_DATE_FORMAT.format(slot.startDateTime)}
              </Text>
              <Text span weight={500} mr='md'>
                <IconClock style={{ position: 'relative', top: '3px' }} size={18} /> {TIME_FORMAT.format(slot.startDateTime)} - {TIME_FORMAT.format(slot.endDateTime)}
              </Text>
              {
                slot.patientId != null
                &&
                <Text span weight={500} mr='md'>
                  <IconUser style={{ position: 'relative', top: '3px' }} size={18} /> {patient ? `${patient.firstName} ${patient.lastName} (${patient.phoneNumber})` : `Patient ID ${slot.patientId}`}
                </Text>
              }
            </div>
            <ActionIcon
              variant='light'
              color='red'
              size='md'
              onClick={onDelete}
              loading={deleting}
              loaderProps={{ size: 20 }}
            >
              <IconTrash size={20} />
            </ActionIcon>
          </Group>
        </Card.Section>
      </Card>
    </>
  );
}

function AddProSlotCard() {
  const form = useForm({
    initialValues: {
      startDateTime: '',
      durationMinutes: 15,
    },
    validate: {
      startDateTime: (value, _) => {
        return isNaN(+new Date(value)) ? 'Date invalide' : null;
      },
    },
  });

  const [isAdding, setIsAdding] = useState(false);

  const onSubmit = async () => {
    setIsAdding(true);
    try {
      const endDate = addMinutes(new Date(form.values.startDateTime), form.values.durationMinutes);
      const endDateTime = toLocalDateTimeString(endDate);

      await addProSlot({
        startDateTime: form.values.startDateTime,
        endDateTime,
      });
      showNotification({ color: 'green', message: 'Créneau ajouté' });

      form.reset();
      form.setFieldValue('startDateTime', endDateTime);
    } catch (e) {
      console.log(e);
      showNotification({ color: 'red', message: 'Une erreur est survenue lors de l\'ajout du créneau. ' });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card radius="md" withBorder mb='xl'>
      <Text weight={500} mb='lg'>Ajouter un nouveau créneau</Text>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <fieldset disabled={isAdding}>
          <Grid mb='xs'>
            <Grid.Col span={6}>
              <TextInput
                required
                withAsterisk={false}
                type='datetime-local'
                label='Début'
                {...form.getInputProps('startDateTime')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                required
                withAsterisk={false}
                min={5}
                step={5}
                label='Durée (minutes)'
                {...form.getInputProps('durationMinutes')}
              />
            </Grid.Col>
          </Grid>

          <Button
            type='submit'
            fullWidth
            variant='light'
            loading={isAdding}
            loaderProps={{ size: 20 }}
            leftIcon={<IconCalendarPlus size={20} />}
          >
            Ajouter
          </Button>
        </fieldset>
      </form>
    </Card>
  );
}

export default function ProSlots() {
  const slots = useProSlots();

  return (
    <Layout title='Mes créneaux'>
      {(() => {
        if (slots.error != null) {
          return (
            <Alert color='red' icon={<IconAlertTriangle />}>Une erreur est survenue lors du chargement des créneaux.</Alert>
          );
        }

        if (slots.data == null) {
          return <Loader />;
        }

        return (
          <>
            {
              slots.data.length === 0
                ? <Alert mb='xl' icon={<IconInfoCircle />}>Vous n'avez aucun créneau.</Alert>
                : slots.data.map(slot => <ProSlotCard slot={slot} key={slot.id} />)
            }

            <AddProSlotCard />
          </>
        );
      })()}
    </Layout>
  )
}
