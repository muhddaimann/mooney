import { View } from 'react-native';
import { Button, Chip, Text } from 'react-native-paper';

import { Card } from '@/components/card';
import { useAppTheme } from '@/hooks/useAppTheme';

type ProjectCardProps = {
  title: string;
  description: string;
  tags?: string[];
  onView?: () => void;
};

/**
 * Portfolio project tile: title, blurb, tech tags, and an optional action.
 */
export function ProjectCard({
  title,
  description,
  tags = [],
  onView,
}: ProjectCardProps) {
  const { tokens } = useAppTheme();

  return (
    <Card style={{ width: '100%', maxWidth: tokens.dimensions.cardMaxWidth }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: tokens.colors.text }}>
          {title}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: tokens.colors.textSecondary, marginTop: tokens.spacing.xs }}
        >
          {description}
        </Text>
        {tags.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: tokens.spacing.xs,
              marginTop: tokens.spacing.md,
            }}
          >
            {tags.map((tag) => (
              <Chip key={tag} compact>
                {tag}
              </Chip>
            ))}
          </View>
        ) : null}
      </Card.Content>
      {onView ? (
        <Card.Actions>
          <Button onPress={onView}>View</Button>
        </Card.Actions>
      ) : null}
    </Card>
  );
}
