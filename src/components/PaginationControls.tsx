import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS} from '../constants/theme';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canGoPrevious && styles.buttonDisabled]}
        onPress={() => canGoPrevious && onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}>
        <Text style={[styles.buttonText, !canGoPrevious && styles.textDisabled]}>
          ← Previous
        </Text>
      </TouchableOpacity>

      <View style={styles.pageInfo}>
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !canGoNext && styles.buttonDisabled]}
        onPress={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}>
        <Text style={[styles.buttonText, !canGoNext && styles.textDisabled]}>
          Next →
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 100,
  },
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  textDisabled: {
    color: COLORS.textSecondary,
  },
  pageInfo: {
    paddingHorizontal: SPACING.md,
  },
  pageText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default PaginationControls;
