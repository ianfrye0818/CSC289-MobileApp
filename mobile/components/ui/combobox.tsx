import { isNil } from 'lodash';
import { ChevronDown, Search } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

// Types
export interface ComboboxItem<T = string> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

type SingleSelectProps<T> = {
  multiple?: false;
  value?: T;
  onChange: (value: T, item: ComboboxItem<T>) => void;
};

type MultiSelectProps<T> = {
  multiple: true;
  value?: T[];
  onChange: (value: T[], items: ComboboxItem<T>[]) => void;
};

type BaseProps<T> = {
  items: ComboboxItem<T>[];
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  disabled?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  // Max list height of the dropdown list
  maxListHeight?: number;
  style?: StyleProp<ViewStyle>;
  // Render a custome item - return null to fall back to default
  renderItem?: (item: ComboboxItem<T>, selected: boolean) => React.ReactNode;
};

export type ComboboxProps<T = string> = BaseProps<T> & (SingleSelectProps<T> | MultiSelectProps<T>);

// Helpers
function isSelected<T>(value: T, selectedValue: T | T[] | undefined, multiple: boolean): boolean {
  if (multiple) {
    return Array.isArray(selectedValue) && selectedValue.some((v) => v === value);
  }
  return selectedValue === value;
}

function getDisplayText<T>(
  items: ComboboxItem<T>[],
  value: T | T[] | undefined,
  multiple: boolean,
  placeholder: string,
): string {
  if (!value || (Array.isArray(value) && value.length === 0)) return placeholder;
  if (multiple && Array.isArray(value)) {
    const selected = items.filter((i) => value.includes(i.value));
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) return selected[0].label;
    return `${selected[0].label} +${selected.length - 1} more`;
  }
  const found = items.find((i) => i.value === value);
  return found?.label ?? placeholder;
}

// Check Icon
function CheckIcon({ color = '#fff' }: { color?: string }) {
  return (
    <View style={styles.checkIcon}>
      <Text style={{ color, fontSize: 11, fontWeight: '700', lineHeight: 14 }}>✓</Text>
    </View>
  );
}

// Chip (multi-select tags)
function Chip<T>({ item, onRemove }: { item: ComboboxItem<T>; onRemove: () => void }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{item.label}</Text>
      <Pressable
        onPress={onRemove}
        hitSlop={6}
        style={styles.chipRemove}
      >
        <Text style={styles.chipRemoveText}>✕</Text>
      </Pressable>
    </View>
  );
}

// Main Component
export function Combobox<T = string>(props: ComboboxProps<T>) {
  const {
    items,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    label,
    disabled = false,
    errorMessage,
    emptyMessage = 'No results found.',
    maxListHeight = 300,
    style,
    renderItem: customRenderItem,
  } = props;

  const multiple = props.multiple === true;
  const currentValue = props.value;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<TextInput>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) || (i.description?.toLowerCase().includes(q) ?? false),
    );
  }, [items, query]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    setTimeout(() => searchRef.current?.focus(), 100);
  }, [disabled]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setQuery('');
    Keyboard.dismiss();
  }, []);

  const handleSelect = useCallback(
    (item: ComboboxItem<T>) => {
      if (item.disabled) return;

      if (multiple) {
        const prev = Array.isArray(currentValue) ? (currentValue as T[]) : [];
        const exists = prev.includes(item.value);
        const next = exists ? prev.filter((v) => v !== item.value) : [...prev, item.value];
        const nextItems = items.filter((i) => next.includes(i.value));
        (props as MultiSelectProps<T>).onChange(next, nextItems);
      } else {
        (props as SingleSelectProps<T>).onChange(item.value, item);
        closeDropdown();
      }
    },
    [multiple, currentValue, items, props, closeDropdown],
  );

  const removeChip = useCallback(
    (value: T) => {
      if (!multiple) return;
      const prev = Array.isArray(currentValue) ? (currentValue as T[]) : [];
      const next = prev.filter((v) => v !== value);
      const nextItems = items.filter((i) => next.includes(i.value));
      (props as MultiSelectProps<T>).onChange(next, nextItems);
    },
    [multiple, currentValue, items, props],
  );

  const selectedItems = useMemo(() => {
    if (!multiple || !Array.isArray(currentValue)) return [];
    return items.filter((i) => (currentValue as T[]).includes(i.value));
  }, [multiple, currentValue, items]);

  const displayText = useMemo(
    () => getDisplayText(items, currentValue, multiple, placeholder),
    [items, currentValue, multiple, placeholder],
  );

  const hasValue = multiple
    ? Array.isArray(currentValue) && currentValue.length > 0
    : !isNil(currentValue);

  const renderRow = useCallback(
    ({ item }: { item: ComboboxItem<T> }) => {
      const selected = isSelected(item.value, currentValue, multiple);
      if (customRenderItem) {
        const node = customRenderItem(item, selected);
        if (node) return <>{node}</>;
      }

      return (
        <Pressable
          style={[styles.row, selected && styles.rowSelected, item.disabled && styles.rowDisabled]}
          onPress={() => handleSelect(item)}
          android_ripple={{ color: 'rgba(99,102,241, 0.12)' }}
        >
          <View style={styles.rowContent}>
            {multiple && (
              <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                {selected && <CheckIcon />}
              </View>
            )}
            <View style={styles.rowText}>
              <Text
                style={[
                  styles.rowLabel,
                  selected && !multiple && styles.rowLabelSelected,
                  item.disabled && styles.rowLabelDisabled,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              {item.description ? (
                <Text
                  style={styles.rowDescription}
                  numberOfLines={1}
                >
                  {item.description}
                </Text>
              ) : null}
            </View>
          </View>
          {selected && !multiple && <Text style={styles.singleCheck}>✓</Text>}
        </Pressable>
      );
    },
    [currentValue, multiple, handleSelect, customRenderItem],
  );

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label ? (
        <Text style={[styles.label, !!errorMessage && styles.labelError]}>{label}</Text>
      ) : null}

      {/* Trigger */}
      <Pressable
        style={[
          styles.trigger,
          open && styles.triggerOpen,
          !!errorMessage && styles.triggerError,
          disabled && styles.triggerDisabled,
        ]}
        onPress={openDropdown}
        accessibilityRole='button'
        accessibilityLabel={label ?? 'Select an option'}
        accessibilityState={{ disabled, expanded: open }}
      >
        {/* Chips or placeholder text */}
        <View style={styles.triggerInner}>
          {multiple && selectedItems.length > 0 ? (
            <View style={styles.chipsRow}>
              {selectedItems.slice(0, 3).map((item) => (
                <Chip
                  key={String(item.value)}
                  item={item}
                  onRemove={() => removeChip(item.value)}
                />
              ))}
              {selectedItems.length > 3 && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>+{selectedItems.length - 3}</Text>
                </View>
              )}
            </View>
          ) : (
            <Text
              style={[styles.triggerText, !hasValue && styles.triggerPlaceholder]}
              numberOfLines={1}
            >
              {displayText}
            </Text>
          )}
        </View>
        {/* Chevron */}
        <ChevronDown
          size={18}
          color={SUBTEXT}
        />
      </Pressable>
      {/* Error */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {/* Dropdown modal */}
      <Modal
        visible={open}
        transparent={true}
        animationType='fade'
        onRequestClose={closeDropdown}
        statusBarTranslucent={true}
      >
        <Pressable
          style={styles.backdrop}
          onPress={closeDropdown}
        >
          {/* Stop press propogation to the sheet itself */}
          <Pressable style={[styles.sheet, { maxHeight: maxListHeight + 120 }]}>
            {/* Search */}
            <View style={styles.searchRow}>
              <Text style={styles.searchIcon}>
                <Search size={18} />
              </Text>
              <TextInput
                ref={searchRef}
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={'#9CA3AF'}
                returnKeyType='search'
                clearButtonMode='while-editing'
                autoCorrect={false}
                autoCapitalize='none'
              />
              {query.length > 0 && (
                <Pressable
                  onPress={() => setQuery('')}
                  hitSlop={8}
                >
                  <Text style={styles.clearBtn}>✕</Text>
                </Pressable>
              )}
            </View>

            {/* Multi-select header */}
            {multiple && Array.isArray(currentValue) && currentValue.length > 0 && (
              <View style={styles.multiHeader}>
                <Text style={styles.multiHeaderText}>{currentValue.length} selected</Text>
                <Pressable
                  onPress={() => (props as MultiSelectProps<T>).onChange([], [])}
                  hitSlop={8}
                >
                  <Text style={styles.clearAll}>Clear all</Text>
                </Pressable>
              </View>
            )}
            {/* List */}
            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.value)}
              renderItem={renderRow}
              keyboardShouldPersistTaps='handled'
              style={{ maxHeight: maxListHeight }}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>{emptyMessage}</Text>
                </View>
              }
            />
            {/* Done Button for multi-select */}
            {multiple && (
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={closeDropdown}
                activeOpacity={0.8}
              >
                <Text style={styles.doneBtnText}>
                  Done
                  {Array.isArray(currentValue) && currentValue.length > 0
                    ? ` (${currentValue.length})`
                    : ''}
                </Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const RADIUS = 6;
const ACCENT = '#6366f1';
const ACCENT_LIGHT = '#eef2ff';
const BORDER = '#e5e7eb';
const TEXT = '#111827';
const SUBTEXT = '#6b7280';
const ERROR = '#ef4444';

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT,
    letterSpacing: 0.1,
  },
  labelError: {
    color: ERROR,
  },

  // ── Trigger ──
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    minHeight: 40,
  },
  triggerOpen: {
    borderColor: ACCENT,
    shadowColor: ACCENT,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  triggerError: {
    borderColor: ERROR,
  },
  triggerDisabled: {
    backgroundColor: '#f9fafb',
    opacity: 0.6,
  },
  triggerInner: {
    flex: 1,
    justifyContent: 'center',
  },
  triggerText: {
    fontSize: 14,
    color: TEXT,
  },
  triggerPlaceholder: {
    color: '#9ca3af',
  },
  // chevron: {
  //   fontSize: 22,
  //   color: SUBTEXT,
  //   transform: [{ rotate: '90deg' }],
  //   marginLeft: 6,
  //   lineHeight: 24,
  // },
  // chevronUp: {
  //   transform: [{ rotate: '-90deg' }],
  //   color: ACCENT,
  // },

  // ── Chips ──
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT_LIGHT,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
    maxWidth: 150,
  },
  chipText: {
    fontSize: 12,
    color: ACCENT,
    fontWeight: '600',
    flexShrink: 1,
  },
  chipRemove: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipRemoveText: {
    fontSize: 15,
    color: ACCENT,
    lineHeight: 16,
    fontWeight: '700',
  },

  // ── Error ──
  error: {
    fontSize: 12,
    color: ERROR,
    marginTop: 2,
  },

  // ── Backdrop & Sheet ──
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  // ── Search ──
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 8,
  },
  searchIcon: {
    fontSize: 18,
    color: SUBTEXT,
    marginTop: -1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT,
    paddingVertical: 0,
  },
  clearBtn: {
    fontSize: 20,
    color: SUBTEXT,
    lineHeight: 22,
  },

  // ── Multi header ──
  multiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: ACCENT_LIGHT,
  },
  multiHeaderText: {
    fontSize: 12,
    color: ACCENT,
    fontWeight: '600',
  },
  clearAll: {
    fontSize: 12,
    color: ERROR,
    fontWeight: '600',
  },

  // ── Rows ──
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  rowSelected: {
    backgroundColor: ACCENT_LIGHT,
  },
  rowDisabled: {
    opacity: 0.4,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    color: TEXT,
  },
  rowLabelSelected: {
    color: ACCENT,
    fontWeight: '600',
  },
  rowLabelDisabled: {
    color: SUBTEXT,
  },
  rowDescription: {
    fontSize: 12,
    color: SUBTEXT,
  },
  singleCheck: {
    color: ACCENT,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },

  // ── Checkbox ──
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  checkIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Empty ──
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: SUBTEXT,
    fontSize: 14,
  },

  // ── Done button ──
  doneBtn: {
    margin: 12,
    backgroundColor: ACCENT,
    borderRadius: RADIUS,
    paddingVertical: 13,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
