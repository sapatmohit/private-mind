import { useTranslation } from "react-i18next";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { Theme } from '../../styles/colors';
import { lineHeights } from '../../styles/fontStyles';
import { space, textStyles } from '../../constants/design-system';
import { formatTimeLeft, secondsLeft } from '../../utils/downloadEta';

interface Props {
  modelSize?: number;
  progress: number;
  rate?: number;
}

const DownloadProgressDetails = ({ modelSize, progress, rate }: Props) => {
  const { t } = useTranslation();
  const { styles } = useThemedStyles(createStyles);
  const remaining = secondsLeft(progress, rate);

  return (
    <View style={styles.detailsRow}>
      {modelSize ? (
        <Text style={styles.bytes} numberOfLines={1}>
          {t("download-progress-details.ofGb", { modelSize: (modelSize * progress).toFixed(2), modelSize2: modelSize.toFixed(2) })}
        </Text>
      ) : null}
      {remaining !== undefined && (
        <Text style={styles.timeLeft} testID="downloading-model-time-left">
          {formatTimeLeft(remaining)}
        </Text>
      )}
    </View>
  );
};

export default DownloadProgressDetails;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    detailsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      columnGap: space.two,
      minHeight: lineHeights.xs,
    },
    bytes: {
      flexShrink: 1,
      ...textStyles.bodyTertiaryRegular,
      fontVariant: ['tabular-nums'],
      color: theme.text.defaultTertiary,
    },
    timeLeft: {
      flexShrink: 1,
      ...textStyles.bodyTertiaryMedium,
      fontVariant: ['tabular-nums'],
      color: theme.text.defaultSecondary,
    },
  });
