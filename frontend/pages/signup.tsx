import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import {
  signUp,
  UserRole,
  UserSignupParams,
  useUser,
} from '@/src/userUtil';
import {
  Button,
  Paper,
  PasswordInput,
  Radio,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconStethoscope,
  IconUser,
} from '@tabler/icons';

export default function Signup() {
  const user = useUser();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      userRole: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      profession: '',
    },
  });

  if (user.data) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return <></>;
  }

  const onSubmit = async () => {
    try {
      const params: UserSignupParams = {
        userRole: form.values.userRole as UserRole,
        email: form.values.email,
        password: form.values.password,
        firstName: form.values.firstName,
        lastName: form.values.lastName,
        phoneNumber: form.values.phoneNumber,
        address: form.values.address,
        profession: form.values.profession,
      };

      await signUp(params);

      router.push('/login');
      showNotification({
        color: 'green',
        message: 'Votre compte a été créé. Vous pouvez maintenant vous connecter.',
      });

    } catch (e) {
      console.error(e);
      showNotification({
        color: 'red',
        message: 'Une erreur est survenue.',
      });
    }
  };

  return (
    <Layout title='Créer un compte'>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" sx={{ maxWidth: '500px' }}>
        <form
          onSubmit={form.onSubmit(onSubmit)}
        >
          <Radio.Group
            label="Je suis un"
            required
            mb='md'
            {...form.getInputProps('userRole')}
          >
            <Radio value="ROLE_USER" label={<><IconUser size={18} /> Utilisateur</>} />
            <Radio value="ROLE_PROFESSIONAL" label={<><IconStethoscope size={18} /> Professionel de santé</>} />
          </Radio.Group>

          <TextInput
            label='E-mail'
            required
            placeholder='foo@example.org'
            type='email'
            mb='md'
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label='Mot de passe'
            required
            mb='md'
            {...form.getInputProps('password')}
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

          {form.values.userRole == 'ROLE_PROFESSIONAL' &&
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

          <Button fullWidth mt='xl' type='submit'>
            Créer mon compte
          </Button>
        </form>
      </Paper>
    </Layout>
  )
}
