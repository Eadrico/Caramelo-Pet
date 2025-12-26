// Pet Chip Component - Shows pet photo and name
import React from 'react';
import { View, Text, Image, Pressable, useColorScheme } from 'react-native';
import { PawPrint } from 'lucide-react-native';
import { Pet } from '@/lib/types';
import { useColors } from '@/components/design-system';

interface PetChipProps {
  pet: Pet;
  selected?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function PetChip({ pet, selected = false, onPress, size = 'medium' }: PetChipProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const sizeConfig = {
    small: { photo: 32, fontSize: 13, padding: 8, gap: 6 },
    medium: { photo: 40, fontSize: 14, padding: 10, gap: 8 },
    large: { photo: 48, fontSize: 15, padding: 12, gap: 10 },
  };

  const config = sizeConfig[size];

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: config.gap,
        paddingHorizontal: config.padding,
        paddingVertical: config.padding,
        backgroundColor: selected
          ? c.accent
          : isDark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.03)',
        borderRadius: 20,
        borderWidth: selected ? 0 : 1,
        borderColor: selected ? 'transparent' : c.border,
      }}
    >
      {/* Photo */}
      <View
        style={{
          width: config.photo,
          height: config.photo,
          borderRadius: config.photo / 2,
          backgroundColor: c.accentLight,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {pet.photoUri ? (
          <Image
            source={{ uri: pet.photoUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <PawPrint size={config.photo * 0.5} color={c.accent} />
        )}
      </View>

      {/* Name */}
      <Text
        style={{
          fontSize: config.fontSize,
          fontWeight: '500',
          color: selected ? '#FFFFFF' : c.text,
        }}
      >
        {pet.name}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

