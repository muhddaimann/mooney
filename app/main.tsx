import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Badge,
  Button,
  Chip,
  Divider,
  ProgressBar,
  Snackbar,
  Text,
  TextInput,
  Tooltip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { ProfileHeader } from '@/components/profileHeader';
import { ProjectCard } from '@/components/projectCard';
import { SegmentedControl } from '@/components/segmentedControl';
import { PickerModal, type PickerOption } from '@/components/shared/pickerModal';
import { StatCard } from '@/components/statCard';
import { Toggle } from '@/components/toggle';
import { about } from '@/constants/about';
import { useThemeMode } from '@/contexts/themeContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOverlay } from '@/hooks/useOverlay';

/* -------------------------------------------------------------------------- */
/*  Layout helpers                                                            */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { tokens } = useAppTheme();
  return (
    <View style={{ marginBottom: tokens.spacing.xxl }}>
      <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
        {title}
      </Text>
      {description ? (
        <Text
          variant="bodyMedium"
          style={{
            color: tokens.colors.textSecondary,
            marginTop: tokens.spacing.xxs,
            marginBottom: tokens.spacing.md,
          }}
        >
          {description}
        </Text>
      ) : (
        <View style={{ height: tokens.spacing.md }} />
      )}
      {children}
    </View>
  );
}

/** Caption-style label used under swatches and samples. */
function Caption({ children }: { children: ReactNode }) {
  const { tokens } = useAppTheme();
  return (
    <Text
      variant="labelSmall"
      style={{ color: tokens.colors.textSecondary, marginTop: tokens.spacing.xs }}
    >
      {children}
    </Text>
  );
}

/** Action group used by the overlay demos: title, description, and a button row. */
function Group({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { tokens } = useAppTheme();
  return (
    <View style={{ marginBottom: tokens.spacing.xl }}>
      <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
        {title}
      </Text>
      {description ? (
        <Text
          variant="bodyMedium"
          style={{
            color: tokens.colors.textSecondary,
            marginTop: tokens.spacing.xxs,
          }}
        >
          {description}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: tokens.spacing.sm,
          marginTop: tokens.spacing.md,
        }}
      >
        {children}
      </View>
    </View>
  );
}

/** Body of the form-modal example; resolves the modal with the entered name. */
function NameForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const { tokens } = useAppTheme();
  const [name, setName] = useState('');
  return (
    <View style={{ gap: tokens.spacing.md }}>
      <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
        Enter a name and submit to resolve the modal promise.
      </Text>
      <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} />
      <Button mode="contained" onPress={() => onSubmit(name.trim() || 'Anonymous')}>
        Submit
      </Button>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Design system sections                                                    */
/* -------------------------------------------------------------------------- */

function Colors() {
  const { tokens } = useAppTheme();
  const entries = Object.entries(tokens.colors);

  return (
    <Section
      title="Colors"
      description="Palette resolves per theme. Toggle the mode above to compare."
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md }}>
        {entries.map(([name, value]) => (
          <View key={name} style={{ width: 104 }}>
            <View
              style={{
                height: 56,
                borderRadius: tokens.radii.md,
                backgroundColor: value,
                borderWidth: tokens.borderWidth.thin,
                borderColor: tokens.colors.border,
              }}
            />
            <Caption>{name}</Caption>
            <Text variant="labelSmall" style={{ color: tokens.colors.textDisabled }}>
              {value}
            </Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Typography() {
  const { tokens } = useAppTheme();
  const sizes = Object.entries(tokens.fontSize);
  const weights = Object.entries(tokens.fontWeight);

  return (
    <Section
      title="Typography"
      description="Font size and weight scales from the token set."
    >
      {sizes.map(([name, size]) => (
        <View
          key={name}
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: tokens.spacing.md,
            marginBottom: tokens.spacing.sm,
          }}
        >
          <Text
            variant="labelSmall"
            style={{ width: 96, color: tokens.colors.textSecondary }}
          >
            {name} · {size}
          </Text>
          <Text
            numberOfLines={1}
            style={{ flexShrink: 1, fontSize: size, color: tokens.colors.text }}
          >
            {about.brand}
          </Text>
        </View>
      ))}

      <Divider style={{ marginVertical: tokens.spacing.md }} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.lg }}>
        {weights.map(([name, weight]) => (
          <View key={name}>
            <Text
              style={{
                fontSize: tokens.fontSize.lg,
                fontWeight: weight,
                color: tokens.colors.text,
              }}
            >
              Aa
            </Text>
            <Caption>
              {name} · {weight}
            </Caption>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Spacing() {
  const { tokens } = useAppTheme();
  const entries = Object.entries(tokens.spacing);

  return (
    <Section title="Spacing" description="4pt baseline grid.">
      {entries.map(([name, value]) => (
        <View
          key={name}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: tokens.spacing.md,
            marginBottom: tokens.spacing.sm,
          }}
        >
          <Text
            variant="labelSmall"
            style={{ width: 88, color: tokens.colors.textSecondary }}
          >
            {name} · {value}
          </Text>
          <View
            style={{
              width: Math.max(value, 1),
              height: 16,
              borderRadius: tokens.radii.xs,
              backgroundColor: tokens.colors.primary,
            }}
          />
        </View>
      ))}
    </Section>
  );
}

function Radii() {
  const { tokens } = useAppTheme();
  const entries = Object.entries(tokens.radii);

  return (
    <Section title="Radii" description="Corner radius scale.">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md }}>
        {entries.map(([name, value]) => (
          <View key={name} style={{ alignItems: 'center', width: 80 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: value,
                backgroundColor: tokens.colors.primaryContainer,
                borderWidth: tokens.borderWidth.thin,
                borderColor: tokens.colors.primary,
              }}
            />
            <Caption>
              {name} · {value}
            </Caption>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Borders() {
  const { tokens } = useAppTheme();
  const entries = Object.entries(tokens.borderWidth);

  return (
    <Section title="Border widths">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md }}>
        {entries.map(([name, value]) => (
          <View key={name} style={{ alignItems: 'center', width: 80 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: tokens.radii.md,
                borderWidth: value,
                borderColor: tokens.colors.borderStrong,
                backgroundColor: tokens.colors.surfaceVariant,
              }}
            />
            <Caption>
              {name} · {value}
            </Caption>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Shadows() {
  const { tokens } = useAppTheme();
  const entries = Object.entries(tokens.shadow);

  return (
    <Section title="Elevation" description="Per-theme shadow ramp.">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.xl }}>
        {entries.map(([name, shadow]) => (
          <View key={name} style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: tokens.radii.lg,
                backgroundColor: tokens.colors.surface,
                ...shadow,
              }}
            />
            <Caption>{name}</Caption>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Icons() {
  const { tokens } = useAppTheme();
  const entries = Object.entries(tokens.iconSize);

  return (
    <Section title="Icon sizes">
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          gap: tokens.spacing.lg,
        }}
      >
        {entries.map(([name, size]) => (
          <View key={name} style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={size}
              color={tokens.colors.secondary}
            />
            <Caption>
              {name} · {size}
            </Caption>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Opacities() {
  const { tokens } = useAppTheme();
  const entries = Object.entries(tokens.opacity);

  return (
    <Section title="Opacity">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md }}>
        {entries.map(([name, value]) => (
          <View key={name} style={{ alignItems: 'center', width: 72 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: tokens.radii.md,
                backgroundColor: tokens.colors.tertiary,
                opacity: value,
              }}
            />
            <Caption>
              {name} · {value}
            </Caption>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Components() {
  const { tokens } = useAppTheme();
  const [toggleOn, setToggleOn] = useState(true);
  const [toggleOff, setToggleOff] = useState(false);

  return (
    <Section
      title="Components"
      description="React Native Paper components themed from the same tokens."
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm }}>
        <Button mode="contained" onPress={() => {}}>
          Contained
        </Button>
        <Button mode="contained-tonal" onPress={() => {}}>
          Tonal
        </Button>
        <Button
          mode="elevated"
          buttonColor={tokens.colors.primaryContainer}
          textColor={tokens.colors.primary}
          onPress={() => {}}
        >
          Elevated
        </Button>
        <Button mode="outlined" onPress={() => {}}>
          Outlined
        </Button>
        <Button mode="text" onPress={() => {}}>
          Text
        </Button>
        <Button mode="contained" icon="rocket-launch" onPress={() => {}}>
          Icon
        </Button>
        <Button mode="contained" disabled onPress={() => {}}>
          Disabled
        </Button>
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: tokens.spacing.sm,
          marginTop: tokens.spacing.lg,
        }}
      >
        <Chip icon="check" onPress={() => {}}>
          Selected
        </Chip>
        <Chip mode="outlined" onPress={() => {}}>
          Outlined
        </Chip>
        <Chip icon="information" onClose={() => {}}>
          Closable
        </Chip>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: tokens.spacing.md,
          marginTop: tokens.spacing.lg,
        }}
      >
        <Toggle value={toggleOn} onValueChange={setToggleOn} />
        <Toggle value={toggleOff} onValueChange={setToggleOff} />
        <Toggle value={false} onValueChange={() => {}} disabled />
        <Text style={{ color: tokens.colors.textSecondary }}>Toggles</Text>
      </View>

      <TextInput
        mode="outlined"
        label="Outlined input"
        placeholder="Type something…"
        style={{ marginTop: tokens.spacing.lg }}
      />
      <TextInput
        mode="flat"
        label="Flat input"
        style={{ marginTop: tokens.spacing.sm }}
      />

      <Card style={{ marginTop: tokens.spacing.lg }}>
        <Card.Title
          title="Card title"
          subtitle="Surface + elevation + outline tokens"
        />
        <Card.Content>
          <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
            Cards compose the surface color, border, and shadow tokens into one
            reusable container.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => {}}>Cancel</Button>
          <Button mode="contained" onPress={() => {}}>
            Confirm
          </Button>
        </Card.Actions>
      </Card>
    </Section>
  );
}

function Navigation() {
  const { tokens } = useAppTheme();
  const overlay = useOverlay();

  const openMenu = async () => {
    const options: PickerOption[] = [
      { value: 'profile', label: 'Profile', icon: 'account', details: 'View and edit your details' },
      { value: 'settings', label: 'Settings', icon: 'cog', details: 'Preferences and configuration' },
      {
        value: 'signout',
        label: 'Sign out',
        icon: 'logout',
        details: 'End your current session',
        destructive: true,
        divider: true,
      },
    ];
    const action = await overlay.modal<string>({
      render: (close) => <PickerModal options={options} onSelect={close} />,
    });
    if (action) overlay.toast({ variant: 'info', message: `Selected: ${action}` });
  };

  return (
    <Section title="Navigation" description="Appbar and menu.">
      <View
        style={{
          borderRadius: tokens.radii.lg,
          overflow: 'hidden',
          borderWidth: tokens.borderWidth.thin,
          borderColor: tokens.colors.border,
        }}
      >
        <Appbar.Header
          statusBarHeight={0}
          style={{ backgroundColor: tokens.colors.surface }}
        >
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title={about.brand} />
          <Appbar.Action icon="magnify" onPress={() => {}} />
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Appbar.Header>
      </View>

      <View style={{ flexDirection: 'row', marginTop: tokens.spacing.lg }}>
        <Button mode="outlined" icon="menu" onPress={openMenu}>
          Open menu
        </Button>
      </View>
    </Section>
  );
}

function Feedback() {
  const { tokens } = useAppTheme();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  return (
    <Section
      title="Feedback"
      description="Progress, badges, tooltips, and snackbars."
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: tokens.spacing.lg,
        }}
      >
        <View style={{ alignItems: 'center', gap: tokens.spacing.xs }}>
          <ActivityIndicator animating />
          <Caption>Spinner</Caption>
        </View>

        <View style={{ alignItems: 'center', gap: tokens.spacing.xs }}>
          <View>
            <MaterialCommunityIcons
              name="bell"
              size={tokens.iconSize.xl}
              color={tokens.colors.textSecondary}
            />
            <Badge style={{ position: 'absolute', top: -4, right: -4 }}>3</Badge>
          </View>
          <Caption>Badge</Caption>
        </View>

        <View style={{ alignItems: 'center', gap: tokens.spacing.xs }}>
          <Tooltip title="Helpful hint" enterTouchDelay={200} leaveTouchDelay={100}>
            <Button mode="contained-tonal" icon="help">
              Hover me
            </Button>
          </Tooltip>
          <Caption>Tooltip</Caption>
        </View>
      </View>

      <Text
        variant="labelSmall"
        style={{
          color: tokens.colors.textSecondary,
          marginTop: tokens.spacing.lg,
          marginBottom: tokens.spacing.xs,
        }}
      >
        Progress
      </Text>
      <ProgressBar progress={0.6} />

      <Button
        mode="outlined"
        style={{ marginTop: tokens.spacing.lg, alignSelf: 'flex-start' }}
        onPress={() => setSnackbarVisible(true)}
      >
        Show snackbar
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{ label: 'Undo', onPress: () => {} }}
      >
        Saved to your portfolio.
      </Snackbar>
    </Section>
  );
}

function Portfolio() {
  const { tokens } = useAppTheme();

  return (
    <Section
      title="Portfolio Components"
      description="Reusable building blocks composed from the tokens."
    >
      <ProfileHeader name="Muhammad Daiman" title="Software Engineer" initials="MD" />

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: tokens.spacing.md,
          marginTop: tokens.spacing.lg,
        }}
      >
        <StatCard icon="folder-multiple" value="12" label="Projects" />
        <StatCard icon="star" value="4.9" label="Rating" />
        <StatCard icon="briefcase" value="5y" label="Experience" />
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: tokens.spacing.md,
          marginTop: tokens.spacing.lg,
        }}
      >
        <ProjectCard
          title={about.brand}
          description="An Expo web portfolio with a token-driven design system."
          tags={['Expo', 'TypeScript', 'Paper']}
          onView={() => {}}
        />
        <ProjectCard
          title="Overlay Kit"
          description="Promise-based alerts, toasts, and windows for React Native Web."
          tags={['Context', 'Portals']}
          onView={() => {}}
        />
      </View>
    </Section>
  );
}

type PreviewWidth = 'sm' | 'md' | 'lg' | 'full';

function ResponsivePreview() {
  const { tokens } = useAppTheme();
  const [width, setWidth] = useState<PreviewWidth>('md');

  const frameWidth = width === 'full' ? '100%' : tokens.breakpoints[width];

  return (
    <Section
      title="Responsive Preview"
      description="Constrain sample content to each breakpoint width."
    >
      <SegmentedControl
        value={width}
        onValueChange={setWidth}
        options={[
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md' },
          { value: 'lg', label: 'lg' },
          { value: 'full', label: 'Full' },
        ]}
      />

      <View
        style={{
          width: frameWidth,
          maxWidth: '100%',
          marginTop: tokens.spacing.lg,
          padding: tokens.spacing.lg,
          gap: tokens.spacing.lg,
          borderRadius: tokens.radii.lg,
          borderWidth: tokens.borderWidth.thin,
          borderColor: tokens.colors.borderStrong,
          backgroundColor: tokens.colors.surfaceVariant,
        }}
      >
        <ProfileHeader name="Muhammad Daiman" title="Software Engineer" initials="MD" />
        <ProjectCard
          title={about.brand}
          description="Resizes to fit the selected breakpoint frame."
          tags={['Responsive']}
        />
      </View>

      <Caption>
        width:{' '}
        {typeof frameWidth === 'number' ? `${frameWidth}px` : frameWidth} ·
        breakpoints {tokens.breakpoints.sm}/{tokens.breakpoints.md}/
        {tokens.breakpoints.lg}/{tokens.breakpoints.xl}
      </Caption>
    </Section>
  );
}

/** The full design-system reference. */
function DesignSystemView() {
  return (
    <>
      <Colors />
      <Typography />
      <Spacing />
      <Radii />
      <Borders />
      <Shadows />
      <Icons />
      <Opacities />
      <Components />
      <Navigation />
      <Feedback />
      <Portfolio />
      <ResponsivePreview />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Overlay demos                                                             */
/* -------------------------------------------------------------------------- */

function OverlaysView() {
  const { tokens } = useAppTheme();
  const overlay = useOverlay();

  /* ------------------------------- Modals ------------------------------ */

  const openStandardModal = () =>
    overlay.modal({
      title: 'Standard modal',
      render: (close) => (
        <View style={{ gap: tokens.spacing.md }}>
          <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
            Centered surface with a backdrop. Press the backdrop or close icon to
            dismiss.
          </Text>
          <Button mode="contained" onPress={() => close('done')}>
            Done
          </Button>
        </View>
      ),
    });

  const openFormModal = async () => {
    const name = await overlay.modal<string>({
      title: 'Form modal',
      variant: 'form',
      render: (close) => <NameForm onSubmit={close} />,
    });
    if (name) overlay.toast({ variant: 'success', message: `Hello, ${name}!` });
  };

  const openFullscreenModal = () =>
    overlay.modal({
      title: 'Fullscreen modal',
      variant: 'fullscreen',
      render: (close) => (
        <View style={{ gap: tokens.spacing.md }}>
          <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
            Fills the viewport — useful for immersive flows.
          </Text>
          <Button mode="contained" onPress={() => close()}>
            Close
          </Button>
        </View>
      ),
    });

  const openBottomSheet = () =>
    overlay.modal({
      title: 'Bottom sheet',
      variant: 'bottom-sheet',
      render: (close) => (
        <View style={{ gap: tokens.spacing.md }}>
          <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
            Anchored to the bottom edge with rounded top corners.
          </Text>
          <Button mode="contained" onPress={() => close()}>
            Close
          </Button>
        </View>
      ),
    });

  /* ------------------------------ Windows ------------------------------ */

  const openWindow = (title: string) =>
    overlay.openWindow({
      title,
      render: ({ close }) => (
        <View style={{ gap: tokens.spacing.sm }}>
          <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
            Drag the title bar to move. Drag the bottom-right corner to resize.
            Click to bring to front.
          </Text>
          <Button mode="text" onPress={close}>
            Close window
          </Button>
        </View>
      ),
    });

  return (
    <>
      <Group title="Alert" description="Single-action notice, awaitable.">
        <Button mode="outlined" onPress={() => overlay.alert({ variant: 'info', title: 'Heads up', message: 'This is an informational alert.' })}>
          Information
        </Button>
        <Button mode="outlined" onPress={() => overlay.alert({ variant: 'success', title: 'Success', message: 'Your changes were saved.' })}>
          Success
        </Button>
        <Button mode="outlined" onPress={() => overlay.alert({ variant: 'warning', title: 'Warning', message: 'Your session expires soon.' })}>
          Warning
        </Button>
        <Button mode="outlined" onPress={() => overlay.alert({ variant: 'error', title: 'Error', message: 'Something went wrong.' })}>
          Error
        </Button>
      </Group>

      <Group title="Confirm" description="Resolves to a boolean.">
        <Button
          mode="outlined"
          onPress={async () => {
            const ok = await overlay.confirm({ title: 'Continue?', message: 'Proceed with this action?' });
            overlay.toast({ variant: ok ? 'success' : 'info', message: ok ? 'Confirmed' : 'Cancelled' });
          }}
        >
          Default
        </Button>
        <Button
          mode="outlined"
          onPress={async () => {
            const ok = await overlay.confirm({ variant: 'error', title: 'Delete project?', message: 'This cannot be undone.', confirmLabel: 'Delete', destructive: true });
            if (ok) overlay.toast({ variant: 'error', message: 'Project deleted' });
          }}
        >
          Destructive
        </Button>
        <Button
          mode="outlined"
          onPress={async () => {
            const publish = await overlay.confirm({ title: 'Publish changes?', message: 'Publish now or keep as a draft.', confirmLabel: 'Publish', cancelLabel: 'Save draft' });
            overlay.toast({ variant: 'info', message: publish ? 'Published' : 'Saved as draft' });
          }}
        >
          Custom Actions
        </Button>
      </Group>

      <Group title="Toast" description="Transient, auto-dismissing (loading persists).">
        <Button mode="outlined" onPress={() => overlay.toast({ variant: 'success', message: 'Saved successfully.' })}>
          Success
        </Button>
        <Button mode="outlined" onPress={() => overlay.toast({ variant: 'error', message: 'Upload failed.' })}>
          Error
        </Button>
        <Button mode="outlined" onPress={() => overlay.toast({ variant: 'warning', message: 'Low storage space.' })}>
          Warning
        </Button>
        <Button mode="outlined" onPress={() => overlay.toast({ variant: 'info', message: 'New update available.' })}>
          Info
        </Button>
      </Group>

      <Group title="Loader" description="Blocking, blurred loading overlay.">
        <Button
          mode="outlined"
          onPress={() => {
            const id = overlay.showLoader('Loading…');
            setTimeout(() => overlay.hideLoader(id), 2000);
          }}
        >
          Show loader
        </Button>
        <Button
          mode="outlined"
          onPress={async () => {
            const work = new Promise((resolve) => setTimeout(resolve, 2000));
            await overlay.withLoader(work, 'Uploading your changes…');
            overlay.toast({ variant: 'success', message: 'Upload complete!' });
          }}
        >
          withLoader + toast
        </Button>
      </Group>

      <Group title="Modal" description="Custom content, resolves on close.">
        <Button mode="outlined" onPress={openStandardModal}>
          Standard
        </Button>
        <Button mode="outlined" onPress={openFormModal}>
          Form
        </Button>
        <Button mode="outlined" onPress={openFullscreenModal}>
          Fullscreen
        </Button>
        <Button mode="outlined" onPress={openBottomSheet}>
          Bottom Sheet
        </Button>
      </Group>

      <Group title="Window" description="Draggable, resizable, focus-managed panels.">
        <Button mode="outlined" onPress={() => openWindow('Window')}>
          Open window
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            openWindow('Alpha');
            openWindow('Bravo');
            openWindow('Charlie');
          }}
        >
          Open a stack of 3
        </Button>
      </Group>

      <Group
        title="Panel"
        description="Floating detail view — slides in over the content on the right."
      >
        {[about.brand, 'Overlay Kit', 'Design System'].map((item) => (
          <Button
            key={item}
            mode="outlined"
            onPress={() =>
              overlay.openPanel({
                title: item,
                render: () => (
                  <>
                    <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
                      {item}
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={{ color: tokens.colors.textSecondary }}
                    >
                      Detail panel for “{item}”. Opening another item swaps the
                      contents in place; the panel stays floating on the right.
                    </Text>
                    <Button
                      mode="contained"
                      onPress={() => overlay.toast({ variant: 'info', message: `Acted on ${item}` })}
                    >
                      Primary action
                    </Button>
                  </>
                ),
              })
            }
          >
            {item}
          </Button>
        ))}
      </Group>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

/** Heading shown above each column of the two-column reference. */
function ColumnHeader({ title, description }: { title: string; description: string }) {
  const { tokens } = useAppTheme();
  return (
    <View style={{ marginBottom: tokens.spacing.xl }}>
      <Text variant="headlineSmall" style={{ color: tokens.colors.text }}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
        {description}
      </Text>
    </View>
  );
}

export default function Main() {
  const { styles, tokens } = useAppTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ backgroundColor: tokens.colors.background }}
        contentContainerStyle={{ padding: tokens.spacing.lg }}
      >
        <View style={styles.content}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: tokens.spacing.md,
              marginBottom: tokens.spacing.xxl,
            }}
          >
            <View style={{ flexShrink: 1 }}>
              <Text variant="headlineMedium" style={{ color: tokens.colors.text }}>
                {about.brand}
              </Text>
              <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
                {about.tagline}
              </Text>
            </View>
            <SegmentedControl
              value={mode}
              onValueChange={setMode}
              options={[
                { value: 'light', label: 'Light', icon: 'weather-sunny' },
                { value: 'dark', label: 'Dark', icon: 'weather-night' },
              ]}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              gap: tokens.spacing.xxl,
            }}
          >
            <View style={{ flex: 1, minWidth: 320 }}>
              <ColumnHeader
                title="Design System"
                description={`Live reference for ${about.brand}'s theme tokens.`}
              />
              <DesignSystemView />
            </View>
            <View style={{ flex: 1, minWidth: 320 }}>
              <ColumnHeader
                title="Overlays"
                description="Promise-based alerts, confirms, toasts, modals, and windows."
              />
              <OverlaysView />
            </View>
          </View>

          <Divider style={{ marginBottom: tokens.spacing.lg }} />
          <Link href="/" asChild>
            <Button mode="text" icon="arrow-left">
              Back to home
            </Button>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
