import { SearchBar } from '@/components/SearchBar';
import { useMemo, useState } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import { ProductListItem } from '../types';
import NoProductsAvailable from './NoProductsAvailable';
import { ProductCard } from './ProductCard';
import { SortFilterModal, type SortOption } from './SortFilterModal';

interface Props {
  products: ProductListItem[];
  refetch: () => void;
  isRefetching: boolean;
}

/**
 * Normalize text for substring search. Strips soft hyphens (U+00AD) and other
 * invisible/format chars — those often sit before the “last word” when names are
 * pasted from Word/CMS and break naive `.includes('console')` on “Game\u00ADConsole”.
 */
function normalizeForSearch(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u00AD\u034F\u200B-\u200D\u2060\uFEFF]/g, '')
    .trim()
    .toLowerCase();
}

function productMatchesQuery(product: ProductListItem, needle: string): boolean {
  const nameHaystack = normalizeForSearch(product.productName ?? '');
  const categoryHaystack = normalizeForSearch(product.category?.categoryName ?? '');
  return nameHaystack.includes(needle) || categoryHaystack.includes(needle);
}

export function ProductGrid({ products, refetch, isRefetching }: Props) {
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;
  const itemWidth = (width - 32 - 12 * (numColumns - 1)) / numColumns;
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const categories = useMemo(() => {
    const seen = new Map<number, string>();
    for (const p of products ?? []) {
      if (p.category && !seen.has(p.category.categoryId)) {
        seen.set(p.category.categoryId, p.category.categoryName);
      }
    }
    return [...seen.entries()]
      .map(([categoryId, categoryName]) => ({ categoryId, categoryName }))
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }, [products]);

  const displayedProducts = useMemo(() => {
    let result = products ?? [];
    const needle = normalizeForSearch(query);
    if (needle) {
      result = result.filter((p) => productMatchesQuery(p, needle));
    }
    if (activeCategory !== null) {
      result = result.filter((p) => p.category?.categoryId === activeCategory);
    }
    return [...result].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.productName.localeCompare(b.productName);
        case 'price-asc':
          return a.unitPrice - b.unitPrice;
        case 'price-desc':
          return b.unitPrice - a.unitPrice;
        case 'category-asc':
          return (a.category?.categoryName ?? '').localeCompare(b.category?.categoryName ?? '');
      }
    });
  }, [products, query, activeCategory, sortOption]);

  return (
    <FlatList
      data={displayedProducts}
      keyExtractor={(item) => String(item.productId)}
      numColumns={numColumns}
      key={numColumns}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
      renderItem={({ item, index }) => {
        const isLonelyLastItem =
          displayedProducts.length % numColumns !== 0 && index === displayedProducts.length - 1;
        if (isLonelyLastItem) {
          return (
            <View style={{ width: itemWidth }}>
              <ProductCard product={item} />
            </View>
          );
        }
        return <ProductCard product={item} />;
      }}
      refreshing={isRefetching}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View className='mb-1 gap-2'>
          <SearchBar
            value={query}
            onSearch={setQuery}
            placeholder='Search products...'
          />
          <SortFilterModal
            categories={categories}
            sortOption={sortOption}
            activeCategory={activeCategory}
            onApply={(sort, category) => {
              setSortOption(sort);
              setActiveCategory(category);
            }}
            onReset={() => {
              setSortOption('name-asc');
              setActiveCategory(null);
            }}
          />
        </View>
      }
      ListEmptyComponent={<NoProductsAvailable />}
    />
  );
}
