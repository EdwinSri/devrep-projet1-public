import {
  PropsWithChildren,
  useState,
} from 'react';

import Layout from '@/components/Layout';
import {
  isPro,
  updateProfile,
  UserProfileChangeParams,
  useUser,
} from '@/src/userUtil';
import {
  Alert,
  Button,
  Loader,
  Modal,
  Table,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconDeviceFloppy,
  IconEdit,
} from '@tabler/icons';

function Th(props: PropsWithChildren) {
  return <td><b {...props}></b></td>
}

function ProfileView() {
  const user = useUser();

  if (!user.data)
    return <></>;

  return (
    <Table sx={{ maxWidth: '1200px' }}>
      <tbody>
        <tr>
          <Th>E-mail</Th>
          <td>{user.data.email}</td>
        </tr>
        <tr>
          <Th>Prénom</Th>
          <td>{user.data.firstName}</td>
        </tr>
        <tr>
          <Th>Nom</Th>
          <td>{user.data.lastName}</td>
        </tr>
        <tr>
          <Th>Téléphone</Th>
          <td>{user.data.phoneNumber}</td>
        </tr>
        {isPro(user.data) &&
          <>
            <tr>
              <Th>Profession</Th>
              <td>{user.data.profession}</td>
            </tr>
            <tr>
              <Th>Adresse</Th>
              <td>{user.data.address}</td>
            </tr>
          </>
        }
      </tbody>
    </Table>
  )
}

interface ProfileEditViewProps {
  opened: boolean,
  setOpened: (_: boolean) => void,
}

function ProfileEditModal(props: ProfileEditViewProps) {
  const user = useUser();
  const form = useForm({ initialValues: user.data });

  if (!user.data)
    return <></>;

  const onSubmit = async () => {
    try {
      const params: UserProfileChangeParams = {
        email: form.values.email,
        firstName: form.values.firstName,
        lastName: form.values.lastName,
        phoneNumber: form.values.phoneNumber,
        address: form.values.address,
        profession: form.values.profession,
      };

      await updateProfile(params);

      showNotification({
        color: 'green',
        message: 'Profil mis à jour.',
      });

      props.setOpened(false);

    } catch (e) {
      console.error(e);
      showNotification({
        color: 'red',
        message: 'Une erreur est survenue.',
      });
    }
  };

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      title='Mise à jour du profil'
      size='lg'
      exitTransitionDuration={100}
    >
      <form
        onSubmit={form.onSubmit(onSubmit)}
      >
        <TextInput
          label='E-mail'
          required
          placeholder='foo@example.org'
          type='email'
          mb='md'
          data-autofocus
          {...form.getInputProps('email')}
        />

        <TextInput
          label='Prénom'
          required
          type='text'
          mb='md'
          {...form.getInputProps('firstName')}
        />

        <TextInput
          label='Nom'
          required
          type='text'
          mb='md'
          {...form.getInputProps('lastName')}
        />

        <TextInput
          label='Téléphone'
          required
          placeholder='06 12 34 56 78'
          type='phone'
          mb='md'
          {...form.getInputProps('phoneNumber')}
        />

        {user.data.userRole == 'ROLE_PROFESSIONAL' &&
          <>
            <TextInput
              label='Adresse'
              required
              placeholder='1 Rue de la Paix, Paris'
              type='text'
              mb='md'
              {...form.getInputProps('address')}
            />
            <TextInput
              label='Profession'
              required
              placeholder='Médecin généraliste'
              type='text'
              mb='md'
              {...form.getInputProps('profession')}
            />
          </>
        }

        <Button fullWidth mt='xl' type='submit' leftIcon={<IconDeviceFloppy />}>
          Enregistrer
        </Button>
      </form>

      <Button fullWidth mt='xs' variant='default' type='submit' onClick={() => props.setOpened(false)}>
        Annuler
      </Button>
    </Modal>
  );
}

export default function Profile() {
  const user = useUser();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Layout title='Mon profil'>
      {user.data == null && user.error != null &&
        <Alert color='red'>Connectez-vous pour accéder à votre profil.</Alert>
      }
      {user.data != null && user.error == null &&
        <>
          <ProfileView />

          <Button
            mt='xl'
            leftIcon={<IconEdit />}
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </Button>
          <ProfileEditModal opened={isEditing} setOpened={setIsEditing} />
        </>
      }
      {user.data == null && user.error == null && <Loader size='xl' />}
    </Layout>
  )
}
