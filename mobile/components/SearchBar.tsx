import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SearchBarProps {
  value: string;
  onSearch: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onSearch, placeholder = 'Search...', className }: SearchBarProps) {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';

  return (
    <View className={cn('flex-row items-center relative', className)}>
      <View className='absolute left-3 z-10'>
        <Search size={16} color={iconColor} />
      </View>
      <Input
        value={value}
        onChangeText={onSearch}
        placeholder={placeholder}
        className='flex-1 pl-9 pr-9'
        clearButtonMode='never'
        returnKeyType='search'
        autoCorrect={false}
        autoCapitalize='none'
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onSearch('')}
          className='absolute right-3 z-10'
          hitSlop={8}
        >
          <X size={16} color={iconColor} />
        </Pressable>
      )}
    </View>
  );
}
