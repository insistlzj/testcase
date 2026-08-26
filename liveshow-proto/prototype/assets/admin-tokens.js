window.LUMA_ADMIN_TOKENS = {
  primary: '#333333',
  primarySoft: '#F2F2F2',
  success: '#237A52',
  successSoft: '#EAF5EF',
  fiatHighlight: '#237A52',
  warning: '#9A6412',
  warningSoft: '#FFF5DE',
  danger: '#B54747',
  dangerSoft: '#FCECEC',
  ink: '#222222',
  muted: '#666666',
  border: '#DDDDDD',
  canvas: '#F5F5F5',
  surface: '#FFFFFF',
  overlay: 'rgba(34,34,34,.28)',
  focusRing: '0 0 0 2px #D7D7D7',
  shadowSm: '0 8px 22px rgba(34,34,34,.12)',
  shadowMd: '-12px 0 30px rgba(34,34,34,.12)',
  shadowLg: '0 18px 48px rgba(34,34,34,.18)',
  fontXs: '12px',
  fontSm: '13px',
  fontBase: '14px',
  fontMd: '16px',
  fontLg: '17px',
  fontXl: '20px',
  font2xl: '22px',
  radiusXs: '4px',
  radiusSm: '6px',
  radiusMd: '8px',
  radiusPill: '999px',
  radiusRound: '50%'
};

const adminTokenStyle = document.createElement('style');
adminTokenStyle.textContent = `:root{
  --admin-primary:${window.LUMA_ADMIN_TOKENS.primary};
  --admin-primary-soft:${window.LUMA_ADMIN_TOKENS.primarySoft};
  --admin-success:${window.LUMA_ADMIN_TOKENS.success};
  --admin-success-soft:${window.LUMA_ADMIN_TOKENS.successSoft};
  --admin-fiat-highlight:${window.LUMA_ADMIN_TOKENS.fiatHighlight};
  --admin-warning:${window.LUMA_ADMIN_TOKENS.warning};
  --admin-warning-soft:${window.LUMA_ADMIN_TOKENS.warningSoft};
  --admin-danger:${window.LUMA_ADMIN_TOKENS.danger};
  --admin-danger-soft:${window.LUMA_ADMIN_TOKENS.dangerSoft};
  --admin-ink:${window.LUMA_ADMIN_TOKENS.ink};
  --admin-muted:${window.LUMA_ADMIN_TOKENS.muted};
  --admin-border:${window.LUMA_ADMIN_TOKENS.border};
  --admin-canvas:${window.LUMA_ADMIN_TOKENS.canvas};
  --admin-surface:${window.LUMA_ADMIN_TOKENS.surface};
  --admin-overlay:${window.LUMA_ADMIN_TOKENS.overlay};
  --admin-focus-ring:${window.LUMA_ADMIN_TOKENS.focusRing};
  --admin-shadow-sm:${window.LUMA_ADMIN_TOKENS.shadowSm};
  --admin-shadow-md:${window.LUMA_ADMIN_TOKENS.shadowMd};
  --admin-shadow-lg:${window.LUMA_ADMIN_TOKENS.shadowLg};
  --admin-font-xs:${window.LUMA_ADMIN_TOKENS.fontXs};
  --admin-font-sm:${window.LUMA_ADMIN_TOKENS.fontSm};
  --admin-font-base:${window.LUMA_ADMIN_TOKENS.fontBase};
  --admin-font-md:${window.LUMA_ADMIN_TOKENS.fontMd};
  --admin-font-lg:${window.LUMA_ADMIN_TOKENS.fontLg};
  --admin-font-xl:${window.LUMA_ADMIN_TOKENS.fontXl};
  --admin-font-2xl:${window.LUMA_ADMIN_TOKENS.font2xl};
  --admin-radius-xs:${window.LUMA_ADMIN_TOKENS.radiusXs};
  --admin-radius-sm:${window.LUMA_ADMIN_TOKENS.radiusSm};
  --admin-radius-md:${window.LUMA_ADMIN_TOKENS.radiusMd};
  --admin-radius-pill:${window.LUMA_ADMIN_TOKENS.radiusPill};
  --admin-radius-round:${window.LUMA_ADMIN_TOKENS.radiusRound};
}`;
document.head.appendChild(adminTokenStyle);
