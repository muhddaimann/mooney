import React from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';
import Constants from 'expo-constants';
import { useDesign } from '../../../contexts/designContext';

const APP_ICON = require('../../../assets/icon.png');

export default function Settings() {
  const { colors, spacing, fonts, fontSize, radii, shadow } = useDesign();

  const name = Constants.expoConfig?.name ?? 'Mooney';
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
      <Image
        source={APP_ICON}
        style={{ width: 96, height: 96, borderRadius: radii.xl, ...shadow.md }}
        resizeMode="cover"
      />
      <Text
        style={{
          color: colors.text,
          fontFamily: fonts.bold,
          fontSize: fontSize.xl,
          marginTop: spacing.md,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fonts.regular,
          fontSize: fontSize.base,
          marginTop: spacing.xs,
        }}
      >
        Version {version}
      </Text>
    </View>
  );
}
