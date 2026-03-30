// src/components/ui/Toast/ToastConfig.tsx
import { AlertCircle, AlertTriangle, Check, Info, Loader } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { type BaseToastProps } from 'react-native-toast-message';

/**
 * Shared layout component used by every toast variant.
 *
 * Renders a coloured pill with an icon on the left and up to two lines of text.
 * The background colour and icon are passed in by each variant so this component
 * only handles layout.
 *
 * @param text1 - Primary (bold) toast message.
 * @param text2 - Optional secondary (sub) message shown below `text1`.
 * @param onPress - Called when the user taps the toast. Often used to navigate
 *   or dismiss manually.
 * @param backgroundColor - The toast's background colour (hex string).
 * @param icon - A React node rendered to the left of the text.
 */
function AppToast({
  text1,
  text2,
  onPress,
  backgroundColor,
  icon,
}: {
  text1?: string;
  text2?: string;
  onPress?: () => void;
  backgroundColor: string;
  icon: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className='flex-row items-center gap-3 mx-4 px-4 py-3 rounded-xl shadow-md'
      style={{ backgroundColor }} // dynamic color, easier than NativeWind for this
    >
      {icon}
      <View className='flex-1'>
        {text1 && <Text className='text-white font-semibold text-sm'>{text1}</Text>}
        {text2 && <Text className='text-white/80 text-xs mt-0.5'>{text2}</Text>}
      </View>
    </Pressable>
  );
}

/**
 * Toast type configuration passed to the `<Toast config={toastConfig} />` component
 * in the root layout.
 *
 * Each key matches a `type` string used in `appToast.*` calls (e.g. `'success'`,
 * `'error'`). `react-native-toast-message` looks up the matching renderer here
 * whenever a toast is shown.
 *
 * To add a new toast type:
 * 1. Add a renderer here.
 * 2. Add a helper method to `appToast` in `lib/toast.ts`.
 */
export const toastConfig = {
  success: ({ text1, text2, onPress }: BaseToastProps) => (
    <AppToast
      text1={text1}
      text2={text2}
      onPress={onPress}
      backgroundColor='#16a34a'
      icon={
        <Check
          size={18}
          color='white'
        />
      }
    />
  ),
  error: ({ text1, text2, onPress }: BaseToastProps) => (
    <AppToast
      text1={text1}
      text2={text2}
      onPress={onPress}
      backgroundColor='#dc2626'
      icon={
        <AlertCircle
          size={18}
          color='white'
        />
      }
    />
  ),
  info: ({ text1, text2, onPress }: BaseToastProps) => (
    <AppToast
      text1={text1}
      text2={text2}
      onPress={onPress}
      backgroundColor='#2563eb'
      icon={
        <Info
          size={18}
          color='white'
        />
      }
    />
  ),
  warning: ({ text1, text2, onPress }: BaseToastProps) => (
    <AppToast
      text1={text1}
      text2={text2}
      onPress={onPress}
      backgroundColor='#d97706'
      icon={
        <AlertTriangle
          size={18}
          color='white'
        />
      }
    />
  ),
  loading: ({ text1, text2, onPress }: BaseToastProps) => (
    <AppToast
      text1={text1}
      text2={text2}
      onPress={onPress}
      backgroundColor='#6366f1'
      icon={
        <Loader
          size={18}
          color='white'
        />
      }
    />
  ),
};
