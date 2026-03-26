import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Controller, FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { z } from 'zod';
import { ErrorMessage } from '../ErrorMessage';
import { Label } from '../ui/label';
import { Text } from '../ui/text';

interface ComboboxFieldProps<T extends z.ZodType<FieldValues>> {
  name: FieldPath<z.infer<T>>;
  label?: string;
  required: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  options: { label: string; value: string }[];
  /** Max height of the dropdown list in pixels. Defaults to 220. */
  maxListHeight?: number;
}

export function ComboboxField<T extends z.ZodType<FieldValues>>({
  name,
  label,
  required,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  options,
  maxListHeight = 220,
}: ComboboxFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<TextInput>(null);
  const form = useFormContext<z.infer<T>>();

  const filtered = useMemo(
    () =>
      query.trim() === ''
        ? options
        : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
    [query, options],
  );

  const toggle = () => {
    if (open) {
      setOpen(false);
      setQuery('');
    } else {
      setOpen(true);
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  };

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const selectedLabel = options.find((o) => o.value === field.value)?.label;

        return (
          <View className='w-full gap-2'>
            {label && (
              <View className='flex-row items-center gap-1'>
                <Label className='text-sm font-medium text-gray-700'>{label}</Label>
                {required && <Text className='text-xs text-red-500'>*</Text>}
              </View>
            )}

            {/* Trigger */}
            <Pressable
              onPress={toggle}
              className={cn(
                'dark:bg-input/30 border-input bg-background flex-row h-10 w-full items-center justify-between rounded-md border px-3 shadow-sm shadow-black/5',
                open && 'border-ring rounded-b-none border-b-0',
                fieldState.error && !open && 'border-destructive',
              )}
            >
              <Text
                className={cn(
                  'text-base',
                  selectedLabel ? 'text-foreground' : 'text-muted-foreground/50',
                )}
              >
                {selectedLabel ?? placeholder}
              </Text>
              {open ? (
                <ChevronUp size={16} className='text-muted-foreground' />
              ) : (
                <ChevronDown size={16} className='text-muted-foreground' />
              )}
            </Pressable>

            {/* Inline dropdown */}
            {open && (
              <View
                className='border-input bg-background border rounded-b-md shadow-sm shadow-black/5 overflow-hidden -mt-2'
                style={{ maxHeight: maxListHeight + 44 }}
              >
                {/* Search row */}
                <View className='flex-row items-center gap-2 px-3 h-11 border-b border-border'>
                  <Search size={14} className='text-muted-foreground' />
                  <TextInput
                    ref={searchRef}
                    className='flex-1 text-sm text-foreground'
                    placeholder={searchPlaceholder}
                    placeholderTextColor='#9ca3af'
                    value={query}
                    onChangeText={setQuery}
                    clearButtonMode='while-editing'
                  />
                </View>

                {/* Options */}
                <FlatList
                  data={filtered}
                  keyExtractor={(item) => item.value}
                  keyboardShouldPersistTaps='handled'
                  style={{ maxHeight: maxListHeight }}
                  renderItem={({ item }) => {
                    const isSelected = field.value === item.value;
                    return (
                      <Pressable
                        onPress={() => {
                          field.onChange(item.value);
                          setOpen(false);
                          setQuery('');
                        }}
                        className='flex-row items-center justify-between px-3 py-2.5 active:bg-muted'
                      >
                        <Text
                          className={cn(
                            'text-sm',
                            isSelected ? 'font-medium text-primary' : 'text-foreground',
                          )}
                        >
                          {item.label}
                        </Text>
                        {isSelected && <Check size={14} className='text-primary' />}
                      </Pressable>
                    );
                  }}
                  ItemSeparatorComponent={() => <View className='h-px bg-border' />}
                  ListEmptyComponent={() => (
                    <View className='items-center py-6'>
                      <Text className='text-sm text-muted-foreground'>No results found.</Text>
                    </View>
                  )}
                />
              </View>
            )}

            <ErrorMessage message={fieldState.error?.message} />
          </View>
        );
      }}
    />
  );
}
