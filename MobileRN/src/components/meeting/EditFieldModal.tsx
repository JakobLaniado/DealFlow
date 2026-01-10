import { useThemedStyles } from '@/hooks/useThemedStyles';
import { borderRadius, spacing } from '@/utils/theme';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type EditableFieldType = 'meetingId' | 'password' | 'displayName';

const FIELD_CONFIG: Record<
  EditableFieldType,
  { label: string; keyboardType: 'default' | 'numeric'; secure: boolean }
> = {
  meetingId: { label: 'Meeting ID', keyboardType: 'numeric', secure: false },
  password: { label: 'Password', keyboardType: 'default', secure: true },
  displayName: {
    label: 'Display Name',
    keyboardType: 'default',
    secure: false,
  },
};

interface EditFieldModalProps {
  visible: boolean;
  field: EditableFieldType | null;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditFieldModal({
  visible,
  field,
  value,
  onChangeText,
  onSave,
  onCancel,
}: EditFieldModalProps) {
  const { colors } = useThemedStyles();
  const config = field ? FIELD_CONFIG[field] : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity
          style={[
            styles.content,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.primary }]}>
              Edit {config?.label}
            </Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={value}
              onChangeText={onChangeText}
              placeholder={`Enter ${config?.label.toLowerCase()}`}
              placeholderTextColor={colors.textSecondary}
              autoFocus
              keyboardType={config?.keyboardType}
              secureTextEntry={config?.secure}
            />
          </View>
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.surfaceLight }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={onSave}
            >
              <Text style={[styles.saveButtonText, { color: colors.white }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  content: {
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    padding: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    minHeight: 44,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
