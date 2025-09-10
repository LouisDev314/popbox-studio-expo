import { Button, SizableText, View, XStack } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ReactElement } from 'react';

interface IProfileOptionProps {
  onPress: () => void;
  icon: ReactElement;
  title: string;
}

const ProfileOption = (props: IProfileOptionProps) => {
  return (
    <Button unstyled width="100%" onPress={props.onPress}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        // padding="$4"
        paddingVertical="$4"
      >
        <XStack alignItems="center">
          <View
            width={26}
            height={26}
            alignItems="center"
            justifyContent="center"
          >
            {props.icon}
          </View>
          <SizableText size="$6" fontWeight="400" marginLeft="$3">
            {props.title}
          </SizableText>
        </XStack>
        <Ionicons name="chevron-forward-outline" color="white" size={24} />
      </XStack>
    </Button>
  );
};

export default ProfileOption;
