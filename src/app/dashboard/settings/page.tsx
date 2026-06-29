'use client';

import { useState, useRef, useEffect } from 'react';
import {
  User, Lock, Camera, Save, Mail, Phone,
  Shield, Bell, CheckCircle, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useCurrentUser, useUpdateProfile, useUploadPhoto, useChangePassword } from '@/hooks/use-user';
import { DashboardTopbar } from '@/components/layout/dashboard-topbar';
import { PageLoader, Skeleton } from '@/components/shared/index';
import { getInitials, formatDate, cn } from '@/lib/utils';

// ─── Tab types ────────────────────────────────────────────────────
type Tab = 'profile' | 'password';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'password',      label: 'Password',       icon: Lock },
  
];

// ─── Avatar ───────────────────────────────────────────────────────
function AvatarSection() {
  const { user }     = useAuth();
  const { data }     = useCurrentUser();
  const uploadPhoto  = useUploadPhoto();
  const fileRef      = useRef<HTMLInputElement>(null);

  const profile = data ?? user;
  const initials = profile?.fullName ? getInitials(profile.fullName) : '??';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto.mutate(file);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-foreground mb-4">Profile Photo</h2>
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          {profile?.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt={profile.fullName}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-border"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center ring-2 ring-border">
              <span className="text-2xl font-bold text-primary-foreground">{initials}</span>
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadPhoto.isPending}
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground shadow-md transition-colors disabled:opacity-60"
            title="Change photo"
          >
            {uploadPhoto.isPending
              ? <div className="w-3.5 h-3.5 border border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              : <Camera className="w-3.5 h-3.5" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">{profile?.fullName}</p>
          <p className="text-sm text-muted-foreground truncate">{profile?.email}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={cn(
              'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium',
              profile?.isEmailVerified
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground',
            )}>
              {profile?.isEmailVerified && <CheckCircle className="w-3 h-3" />}
              {profile?.isEmailVerified ? 'Verified' : 'Unverified'}
            </span>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile form ─────────────────────────────────────────────────
function ProfileTab() {
  const { user }      = useAuth();
  const { data, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState({ fullName: '', phone: '' });

  // Populate once data arrives
  useEffect(() => {
    const source = data ?? user;
    if (source) setForm({ fullName: source.fullName ?? '', phone: source.phone ?? '' });
  }, [data, user]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ fullName: form.fullName, phone: form.phone || undefined });
  };

  if (isLoading) return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  const profile = data ?? user;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <User className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Personal Information</h2>
      </div>

      {/* Full name */}
      <Field label="Full Name" icon={User}>
        <input
          type="text"
          value={form.fullName}
          onChange={set('fullName')}
          required
          placeholder="Your full name"
          className="input-base"
        />
      </Field>

      {/* Phone */}
      <Field label="Phone Number" icon={Phone}>
        <input
          type="tel"
          value={form.phone}
          onChange={set('phone')}
          placeholder="+1 234 567 8900"
          className="input-base"
        />
      </Field>

      {/* Email — read-only */}
      <Field label="Email Address" icon={Mail} hint="Email cannot be changed">
        <input
          type="email"
          value={profile?.email ?? ''}
          disabled
          className="input-base opacity-50 cursor-not-allowed"
        />
      </Field>

      <div className="pt-1">
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

// ─── Password form ────────────────────────────────────────────────
function PasswordTab() {
  const changePassword = useChangePassword();
  const [form, setForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [show, setShow] = useState({
    current: false, next: false, confirm: false,
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const mismatch = form.confirmPassword.length > 0 &&
    form.newPassword !== form.confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return;
    changePassword.mutate(
      { currentPassword: form.currentPassword, newPassword: form.newPassword },
      { onSuccess: () => setForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) },
    );
  };

  const fields: {
    key: keyof typeof form;
    label: string;
    showKey: keyof typeof show;
    placeholder: string;
  }[] = [
    { key: 'currentPassword', label: 'Current Password',     showKey: 'current', placeholder: '••••••••' },
    { key: 'newPassword',     label: 'New Password',          showKey: 'next',    placeholder: 'Min. 8 characters' },
    { key: 'confirmPassword', label: 'Confirm New Password',  showKey: 'confirm', placeholder: 'Repeat new password' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Lock className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Change Password</h2>
      </div>

      {fields.map(({ key, label, showKey, placeholder }) => (
        <Field key={key} label={label} icon={Lock}
          error={key === 'confirmPassword' && mismatch ? 'Passwords do not match' : undefined}>
          <div className="relative">
            <input
              type={show[showKey] ? 'text' : 'password'}
              value={form[key]}
              onChange={set(key)}
              required
              minLength={key !== 'currentPassword' ? 8 : 1}
              placeholder={placeholder}
              className={cn('input-base pr-10', key === 'confirmPassword' && mismatch && 'border-destructive focus:ring-destructive')}
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
      ))}

      {/* Strength hint */}
      {form.newPassword.length > 0 && (
        <PasswordStrength password={form.newPassword} />
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={changePassword.isPending || mismatch || !form.currentPassword || !form.newPassword}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Shield className="w-4 h-4" />
          {changePassword.isPending ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}


// ─── Password strength indicator ──────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter',      pass: /[A-Z]/.test(password) },
    { label: 'Number',                pass: /\d/.test(password) },
    { label: 'Special character',     pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-destructive', 'bg-destructive', 'bg-accent', 'bg-primary', 'bg-primary'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={cn(
            'h-1.5 flex-1 rounded-full transition-all',
            i < score ? colors[score] : 'bg-muted',
          )} />
        ))}
        <span className={cn('text-xs font-medium ml-1', score >= 3 ? 'text-primary' : 'text-muted-foreground')}>
          {labels[score]}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map(({ label, pass }) => (
          <p key={label} className={cn('text-xs flex items-center gap-1', pass ? 'text-primary' : 'text-muted-foreground')}>
            <CheckCircle className={cn('w-3 h-3 shrink-0', pass ? 'text-primary' : 'text-muted-foreground/30')} />
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Shared field wrapper ─────────────────────────────────────────
function Field({
  label, icon: Icon, hint, error, children,
}: {
  label: string;
  icon: any;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');

  return (
    <div>
      <DashboardTopbar title="Settings" subtitle="Manage your account and preferences" />

      <div className="p-6 space-y-6 fade-in max-w-2xl">

        {/* Avatar always visible */}
        <AvatarSection />

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-secondary border border-border rounded-xl w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                tab === id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'profile'       && <ProfileTab />}
        {tab === 'password'      && <PasswordTab />}
       
      </div>

      {/* Global input style — injected once per page */}
      <style jsx global>{`
        .input-base {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border-radius: 0.75rem;
          background: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          font-size: 0.875rem;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
        }
        .input-base::placeholder { color: hsl(var(--muted-foreground) / 0.5); }
        .input-base:focus {
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }
      `}</style>
    </div>
  );
}