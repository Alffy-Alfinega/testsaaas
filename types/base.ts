import type { Prisma } from '../lib/generated/prisma';

type ApiError = {
  code: number;
  message: string;
  values: { [key: string]: string };
};

export type ApiResponse<T = unknown> =
  | {
      data: T;
      error: never;
    }
  | {
      data: never;
      error: ApiError;
    };

export type TeamWithMemberCount = Prisma.TeamGetPayload<{
  include: {
    _count: {
      select: { members: true };
    };
  };
}>;

export type WebhookFormSchema = {
  name: string;
  url: string;
  eventTypes: string[];
};

export type AppEvent =
  | 'invitation.created'
  | 'invitation.removed'
  | 'invitation.fetched'
  | 'member.created'
  | 'member.removed'
  | 'member.left'
  | 'member.fetched'
  | 'member.role.updated'
  | 'user.password.updated'
  | 'user.password.request'
  | 'user.updated'
  | 'user.signup'
  | 'user.password.reset'
  | 'team.fetched'
  | 'team.created'
  | 'team.updated'
  | 'team.removed'
  | 'apikey.created'
  | 'apikey.removed'
  | 'apikey.fetched'
  | 'apikey.removed'
  | 'webhook.created'
  | 'webhook.removed'
  | 'webhook.fetched'
  | 'webhook.updated';

export type AUTH_PROVIDER =
  | 'github'
  | 'google'
  | 'saml'
  | 'email'
  | 'credentials'
  | 'idp-initiated';

export interface TeamFeature {
  sso: boolean;
  dsync: boolean;
  auditLog: boolean;
  webhook: boolean;
  apiKey: boolean;
  payments: boolean;
  deleteTeam: boolean;
}

// react-daisyui's ComponentStatus type is internal (dist/types.ts) and not part
// of its public exports map — importing 'react-daisyui/dist/types' directly
// worked under Next 15's looser module resolution but is rejected by Next 16.
// Mirrors the literal set from react-daisyui's own dist/constants.d.ts
// (componentStatuses) rather than depending on an unsupported deep import path.
export type ComponentStatus = 'info' | 'success' | 'warning' | 'error';
