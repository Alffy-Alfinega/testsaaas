import { Error, Loading } from '@/components/shared';
import { TeamTab } from '@/components/team';
import { ConnectionsWrapper } from '@boxyhq/react-ui/sso';
import { Themer } from '@boxyhq/react-ui/shared';
import useTeam from 'hooks/useTeam';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import colors from 'tailwindcss/colors';
import env from '@/lib/env';
import { BOXYHQ_UI_CSS } from '@/components/styles';

const TeamSSO = ({ teamFeatures, SPConfigURL }) => {
  const { t } = useTranslation('common');

  const { isLoading, isError, team } = useTeam();

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
      <TeamTab activeTab="sso" team={team} teamFeatures={teamFeatures} />
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
        <ConnectionsWrapper
          urls={{
            spMetadata: SPConfigURL,
            get: `/api/teams/${team.slug}/sso`,
            post: `/api/teams/${team.slug}/sso`,
            patch: `/api/teams/${team.slug}/sso`,
            delete: `/api/teams/${team.slug}/sso`,
          }}
          successCallback={({
            operation,
            connectionIsSAML,
            connectionIsOIDC,
          }) => {
            const ssoType = connectionIsSAML
              ? 'SAML'
              : connectionIsOIDC
                ? 'OIDC'
                : '';
            if (operation === 'CREATE') {
              toast.success(`${ssoType} connection created successfully.`);
            } else if (operation === 'UPDATE') {
              toast.success(`${ssoType} connection updated successfully.`);
            } else if (operation === 'DELETE') {
              toast.success(`${ssoType} connection deleted successfully.`);
            } else if (operation === 'COPY') {
              toast.success(`Contents copied to clipboard`);
            }
          }}
          errorCallback={(errMessage) => toast.error(errMessage)}
          classNames={BOXYHQ_UI_CSS}
          componentProps={{
            connectionList: {
              cols: ['provider', 'type', 'status', 'actions'],
            },
            editOIDCConnection: { displayInfo: false },
            editSAMLConnection: { displayInfo: false },
          }}
        />
      </Themer>
    </>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  if (!env.teamFeatures.sso) {
    return {
      notFound: true,
    };
  }

  const SPConfigURL = env.jackson.selfHosted
    ? `${env.jackson.externalUrl}/.well-known/saml-configuration`
    : '/well-known/saml-configuration';

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      teamFeatures: env.teamFeatures,
      SPConfigURL,
    },
  };
}

export default TeamSSO;
