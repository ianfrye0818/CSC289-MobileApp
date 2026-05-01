import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export type SortOption = 'name-asc' | 'price-asc' | 'price-desc' | 'category-asc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'category-asc', label: 'Category (A–Z)' },
];

const SORT_LABELS: Record<SortOption, string> = {
  'name-asc': 'Name (A–Z)',
  'price-asc': 'Price: Low → High',
  'price-desc': 'Price: High → Low',
  'category-asc': 'Category (A–Z)',
};

interface SortFilterModalProps {
  categories: { categoryId: number; categoryName: string }[];
  sortOption: SortOption;
  activeCategory: number | null;
  onApply: (sort: SortOption, category: number | null) => void;
  onReset: () => void;
}

function SelectablePill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'px-3 py-1.5 rounded-full border',
        selected ? 'bg-primary border-primary' : 'bg-background border-border',
      )}>
      <Text
        className={cn(
          'text-sm font-medium',
          selected ? 'text-primary-foreground' : 'text-foreground',
        )}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SortFilterModal({
  categories,
  sortOption,
  activeCategory,
  onApply,
  onReset,
}: SortFilterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftSort, setDraftSort] = useState<SortOption>(sortOption);
  const [draftCategory, setDraftCategory] = useState<number | null>(activeCategory);

  useEffect(() => {
    if (isOpen) {
      setDraftSort(sortOption);
      setDraftCategory(activeCategory);
    }
  }, [isOpen]);

  const activeCount = (sortOption !== 'name-asc' ? 1 : 0) + (activeCategory !== null ? 1 : 0);

  return (
    <View className='gap-2'>
      <View className='flex-row items-center'>
        <Dialog
          open={isOpen}
          onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Pressable
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'self-start gap-2')}>
              <Icon
                as={SlidersHorizontal}
                size={14}
                className='text-foreground'
              />
              <Text className='text-sm font-medium'>Sort & Filter</Text>
              {activeCount > 0 && (
                <View className='bg-primary rounded-full w-5 h-5 items-center justify-center'>
                  <Text className='text-primary-foreground text-xs font-bold leading-none'>
                    {activeCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </DialogTrigger>

          <DialogContent className='gap-0'>
            <DialogHeader className='mb-4'>
              <DialogTitle>Sort & Filter</DialogTitle>
            </DialogHeader>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 400 }}
              contentContainerStyle={{ gap: 20 }}>
              <View className='gap-2'>
                <Text className='text-sm font-semibold text-muted-foreground'>Sort By</Text>
                <View className='flex-row flex-wrap gap-2'>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectablePill
                      key={opt.value}
                      label={opt.label}
                      selected={draftSort === opt.value}
                      onPress={() => setDraftSort(opt.value)}
                    />
                  ))}
                </View>
              </View>

              <View className='gap-2'>
                <Text className='text-sm font-semibold text-muted-foreground'>
                  Filter by Category
                </Text>
                <View className='flex-row flex-wrap gap-2'>
                  <SelectablePill
                    label='All'
                    selected={draftCategory === null}
                    onPress={() => setDraftCategory(null)}
                  />
                  {categories.map((cat) => (
                    <SelectablePill
                      key={cat.categoryId}
                      label={cat.categoryName}
                      selected={draftCategory === cat.categoryId}
                      onPress={() => setDraftCategory(cat.categoryId)}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>

            <DialogFooter className='mt-4'>
              <Button
                variant='ghost'
                onPress={() => {
                  onReset();
                  setIsOpen(false);
                }}>
                <Text>Reset</Text>
              </Button>
              <Button
                variant='default'
                onPress={() => {
                  onApply(draftSort, draftCategory);
                  setIsOpen(false);
                }}>
                <Text>Apply</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>

      {activeCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}>
          {sortOption !== 'name-asc' && (
            <Pressable
              onPress={() => onApply('name-asc', activeCategory)}
              className='flex-row items-center gap-1 bg-primary rounded-full px-3 py-1'>
              <Text className='text-primary-foreground text-xs font-medium'>
                {SORT_LABELS[sortOption]}
              </Text>
              <Icon
                as={X}
                size={12}
                className='text-primary-foreground'
              />
            </Pressable>
          )}
          {activeCategory !== null && (
            <Pressable
              onPress={() => onApply(sortOption, null)}
              className='flex-row items-center gap-1 bg-primary rounded-full px-3 py-1'>
              <Text className='text-primary-foreground text-xs font-medium'>
                {categories.find((c) => c.categoryId === activeCategory)?.categoryName}
              </Text>
              <Icon
                as={X}
                size={12}
                className='text-primary-foreground'
              />
            </Pressable>
          )}
        </ScrollView>
      )}
    </View>
  );
}
