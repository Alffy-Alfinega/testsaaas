import { Error, Loading } from '@/components/shared';
import { TeamTab } from '@/components/team';
import useTeam from 'hooks/useTeam';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toast } from 'react-hot-toast';
import env from '@/lib/env';
import { DirectoriesWrapper } from '@boxyhq/react-ui/dsync';
import { Themer } from '@boxyhq/react-ui/shared';
import colors from 'tailwindcss/colors';
import { BOXYHQ_UI_CSS } from '@/components/styles';

const DirectorySync = ({ teamFeatures }) => {
  const { isLoading, isError, team } = useTeam();
  const { t } = useTranslation('common');

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!team) {
    return <Error message={t('team-not-found')} />;
  }

  return (
    <>
      <TeamTab
        activeTab="directory-sync"
        team={team}
        teamFeatures={teamFeatures}
      />
      <Themer
        overrideTheme={{
          '--primary-color': colors.blue['500'],
          '--primary-hover': colors.blue['600'],
          '--primary-color-50': colors.blue['50'],
          '--primary-color-100': colors.blue['100'],
          '--primary-color-200': colors.blue['200'],
          '--primary-color-300': colors.blue['300'],
          '--primary-color-500': colors.blue['500'],
          '--primary-color-600': colors.blue['600'],
          '--primary-color-700': colors.blue['700'],
          '--primary-color-800': colors.blue['800'],
          '--primary-color-900': colors.blue['900'],
          '--primary-color-950': colors.blue['950'],
        }}
      >
        <DirectoriesWrapper
          classNames={BOXYHQ_UI_CSS}
          componentProps={{
            directoryList: {
              cols: ['name', 'type', 'status', 'actions'],
              hideViewAction: true,
            },
            createDirectory: {
              excludeFields: [
                'product',
                'tenant',
                'webhook_secret',
                'webhook_url',
                'log_webhook_events',
              ],
              disableGoogleProvider: true,
            },
            editDirectory: {
              excludeFields: [
                'webhook_url',
                'webhook_secret',
                'log_webhook_events',
              ],
            },
          }}
          urls={{
            get: `/api/teams/${team.slug}/dsync`,
            post: `/api/teams/${team.slug}/dsync`,
            patch: `/api/teams/${team.slug}/dsync`,
            delete: `/api/teams/${team.slug}/dsync`,
          }}
          successCallback={({ operation }) => {
            if (operation === 'CREATE') {
              toast.success(`Connection created successfully.`);
            } else if (operation === 'UPDATE') {
              toast.success(`Connection updated successfully.`);
            } else if (operation === 'DELETE') {
              toast.success(`Connection deleted successfully.`);
            } else if (operation === 'COPY') {
              toast.success(`Contents copied to clipboard`);
            }
          }}
          errorCallback={(errMessage) => toast.error(errMessage)}
        />
      </Themer>
    </>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  if (!env.teamFeatures.dsync) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      teamFeatures: env.teamFeatures,
    },
  };
}

export default DirectorySync;
