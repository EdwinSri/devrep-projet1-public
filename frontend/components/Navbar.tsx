import Link from 'next/link';
import { useRouter } from 'next/router';

import * as userUtil from '@/src/userUtil';
import {
  Badge,
  createStyles,
  Group,
  Navbar,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import * as icons from '@tabler/icons';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    navbar: {
      backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
        .background,
      color: theme.white,
      fontWeight: 'bold',
      fontSize: '110%',
    },

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.1
      )}`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.1
      )}`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.white,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.fn.lighten(
          theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
          0.05
        ),
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.white,
      opacity: 0.75,
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.lighten(
          theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
          0.15
        ),
        [`& .${icon}`]: {
          opacity: 0.9,
        },
      },
    },
  };
});

interface LinkInfo {
  link: string;
  label: string;
  icon: icons.TablerIcon;
  filter?: (user?: userUtil.User) => void;
}

const data: LinkInfo[] = [
  { link: '/search', label: 'Trouver un rendez-vous', icon: icons.IconSearch },

  { link: '/pro/slots', label: 'Mes créneaux', icon: icons.IconCalendarTime },
  { link: '/user/appointments', label: 'Mes rendez-vous', icon: icons.IconCalendarTime },

  { link: '/profile', label: 'Mon profil', icon: icons.IconUserCircle, filter: (user) => user != null },
];

export function MyNavbar() {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const user = userUtil.useUser();

  const logOut = async () => {
    try {
      await userUtil.logOut();
      router.push('/');
    } catch (e) {
      console.error(e);
      showNotification({
        color: 'red',
        message: 'Une erreur est survenue lors de la tentative de déconnexion.',
      });
    }
  };

  const links = data
    .filter(item => item.filter == null || item.filter(user.data))
    .filter(item => {
      if (item.link.startsWith('/pro/') && !userUtil.isPro(user.data))
        return false;

      if (item.link.startsWith('/user/') && !userUtil.isUser(user.data))
        return false;

      return true;
    })
    .map(item => (
      <Link
        className={cx(classes.link, { [classes.linkActive]: item.link === router.pathname })}
        href={item.link}
        key={item.label}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </Link>
    ));

  return (
    <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section grow>
        <Group className={classes.header}>
          <icons.IconStethoscope /> Drlib {userUtil.isPro(user.data) && <Badge>Pro</Badge>}
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {user.data != null
          ?
          <Link href='#' className={classes.link} onClick={e => { e.preventDefault(); logOut(); }}>
            <icons.IconLogout className={classes.linkIcon} stroke={1.5} />
            Se déconnecter
          </Link>
          :
          <>
            <Link href='/signup' className={classes.link}>
              <icons.IconUser className={classes.linkIcon} stroke={1.5} />
              Créer un compte
            </Link>
            <Link href='/login' className={classes.link}>
              <icons.IconLogin className={classes.linkIcon} stroke={1.5} />
              Se connecter
            </Link>
          </>}
      </Navbar.Section>
    </Navbar>
  );
}
