import {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import * as timeSlotsApi from '@/src/timeSlotsApi';
import {
  isUser,
  useUser,
} from '@/src/userUtil';
import {
  ActionIcon,
  Alert,
  Autocomplete,
  Badge,
  Card,
  Grid,
  Group,
  Loader,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconArrowRight,
  IconSearch,
} from '@tabler/icons';

const TEST_DATA = [
  {
    firstName: 'AA',
    lastName: 'AAA',
    address: '1 Rue de la Paix',
    profession: 'Médecin généraliste',
    freeTimeSlots: [],
  },
  {
    firstName: 'BB',
    lastName: 'BBB',
    address: '2 Rue de la Paix',
    profession: 'Médecin généraliste',
    freeTimeSlots: [],
  },
  {
    firstName: 'Jador',
    lastName: 'Deverepe',
    address: '3 Rue de la Paix',
    profession: 'Médecin généraliste',
    freeTimeSlots: [...Array(7).keys()].map(i => ({
      id: -1,
      startDateTime: new Date(Date.now() + i * 900_000),
      endDateTime: new Date(Date.now() + (i + 1) * 900_000),
      professionalId: -1,
      patientId: -1,
    })),
  },
];

type ResultCardProps = {
  result: timeSlotsApi.SearchResult;
};

function ResultCard(props: ResultCardProps) {
  const user = useUser();
  const router = useRouter();
  const result = props.result;

  const bookAppointment = async (slot: timeSlotsApi.TimeSlot) => {
    let cannotBook = false;
    if (cannotBook) {
      showNotification({ color: 'red', message: 'Contactez le professionnel de santé pour prendre rendez-vous.' });
      return;
    }

    if (!isUser(user.data)) {
      showNotification({ color: 'red', message: 'Connectez-vous en tant qu\'utilisateur pour prendre rendez-vous.' });
      return;
    }

    try {
      await timeSlotsApi.bookUserAppointment(slot.id);
      showNotification({ color: 'green', message: 'Rendez-vous enregistré' });
      router.push('/user/appointments');
    } catch (e) {
      console.log(e);
      showNotification({ color: 'red', message: 'Une erreur est survenue lors de la prise de rendez-vous.' });
    }
  };

  return (
    <Card p="lg" radius="md" withBorder mb='xl'>
      <Grid>
        <Grid.Col span={5}>
          <Group>
            <Text weight={500}>{result.firstName} {result.lastName}</Text>
            <Badge color='cyan' variant='light'>
              {result.profession}
            </Badge>
          </Group>
          <Text size="sm" color="dimmed">
            {result.address}
          </Text>
        </Grid.Col>

        <Grid.Col span={7}>
          <TimeSlotGrid
            slots={result.freeTimeSlots}
            bookAppointment={bookAppointment}
          />
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default function Search() {
  const user = useUser();
  const router = useRouter();

  const searchForm = useForm({
    initialValues: {
      query: '',
    },
  });

  const [searchResults, setSearchResults] = useState<timeSlotsApi.SearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  const search = async () => {
    if (searchForm.values.query !== router.query.q) {
      router.push(router.asPath, { query: { q: searchForm.values.query } });
    }

    setSearching(true);
    try {
      if (searchForm.values.query == '__test__') {
        setSearchResults(TEST_DATA);
      } else {
        const results = await timeSlotsApi.search(searchForm.values.query);
        setSearchResults(results);
      }
    } catch (e) {
      console.error(e);
      showNotification({
        color: 'red',
        message: 'Une erreur est survenue lors de la recherche. Veuillez réessayer.',
      });
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!router.isReady || router.query.q == null || router.query.q === '')
      return;

    searchForm.values.query = router.query.q as string;
    search();
  }, [router.isReady]);

  return (
    <Layout title='Trouver un rendez-vous'>
      <form onSubmit={searchForm.onSubmit(search)}>
        <Autocomplete
          type='search'
          placeholder='Spécialité'
          required
          size='lg'
          radius='xl'
          disabled={searching}
          data={['Médecin généraliste', 'Dermatologue', 'Dentiste']}
          {...searchForm.getInputProps('query')}

          icon={<IconSearch />}
          rightSection={
            searching
              ? <Loader />
              :
              <ActionIcon size={32} radius='xl' color='blue' variant='filled' type='submit'>
                <IconArrowRight size={18} stroke={1.5} />
              </ActionIcon>
          }
          rightSectionWidth={50}
        />
      </form>

      {
        searchResults != null &&
        <>
          <Text c='dimmed' mt='md' mb='lg'>{searchResults.length} résultat{searchResults.length > 1 && 's'}</Text>

          {!isUser(user.data) &&
            <Alert color='orange' mb='xl' icon={<IconAlertCircle />}>La prise de rendez-vous est réservée aux utilisateurs patients.</Alert>
          }

          {searchResults.map((result, idx) => <ResultCard key={Object.values(result).join('\0')} result={result} />)}
        </>
      }
    </Layout>
  )
}
