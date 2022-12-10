import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import {
  logIn,
  useUser,
} from '@/src/userUtil';
import {
  Button,
  Paper,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

export default function Login() {
  const user = useUser();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
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
      const ok = await logIn(form.values.email, form.values.password);
      if (!ok) {
        showNotification({
          color: 'red',
          message: 'E-mail ou mot de passe incorrect.',
        });
      }
    } catch (e) {
      console.error(e);
      showNotification({
        color: 'red',
        message: 'Une erreur est survenue. Veuillez vérifier votre connexion réseau.',
      });
    }
  };

  return (
    <Layout title='Se connecter'>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" sx={{ maxWidth: '500px' }}>
        <form
          onSubmit={form.onSubmit(onSubmit)}
        >
          <TextInput label='E-mail' placeholder='foo@example.org' required withAsterisk={false} type='email' {...form.getInputProps('email')} />
          <PasswordInput label='Mot de passe' required withAsterisk={false} mt='md' {...form.getInputProps('password')} />
          <Button fullWidth mt='xl' type='submit'>
            Se connecter
          </Button>
        </form>
      </Paper>
    </Layout>
  )
}
