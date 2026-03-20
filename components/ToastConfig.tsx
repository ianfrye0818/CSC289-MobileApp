// src/components/ui/Toast/ToastConfig.tsx
import { AlertCircle, AlertTriangle, Check, Info, Loader } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { type BaseToastProps } from 'react-native-toast-message';

// Reusable layout for all your toast types
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
