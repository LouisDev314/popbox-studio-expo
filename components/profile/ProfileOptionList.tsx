import ProfileOption from '@/components/profile/ProfileOption';
import React from 'react';
import { AntDesign, Feather, Fontisto, Ionicons, Octicons } from '@expo/vector-icons';
import { Separator, SizableText, View } from 'tamagui';
import { router } from 'expo-router';
import { AppScreen } from '@/enums/screens';

const ProfileOptionList = () => {
  const handleEditProfile = () => {
    console.log('handleEditProfile');
  };

  const handleOpenWishlist = () => {
    router.push({
      pathname: AppScreen.Wishlist,
    });
  };

  return (
    <View width="100%" justifyContent="space-between">
      <ProfileOption
        onPress={handleEditProfile}
        icon={<Ionicons name="person-outline" color="white" size={26} />}
        title="Edit Profile"
      />
      <ProfileOption
        onPress={handleEditProfile}
        icon={<Feather name="map-pin" color="white" size={26} />}
        title="Shipping Address"
      />
      <ProfileOption
        onPress={handleOpenWishlist}
        icon={<Octicons name="heart" color="white" size={26} />}
        title="Wishlist"
      />
      <ProfileOption
        onPress={handleEditProfile}
        icon={<Octicons name="history" color="white" size={26} />}
        title="Order History"
      />

      <Separator marginVertical={5} width="100%" borderWidth={3} />
      <SizableText alignSelf="flex-start" size="$6" marginTop="$2">Social Media</SizableText>
      <ProfileOption
        onPress={handleEditProfile}
        icon={<Feather name="instagram" color="white" size={26} />}
        title="Instagram"
      />
      <ProfileOption
        onPress={handleEditProfile}
        icon={<Ionicons name="logo-tiktok" color="white" size={26} />}
        title="TikTok"
      />
      <ProfileOption
        onPress={handleEditProfile}
        icon={<Fontisto name="facebook" color="white" size={26} />}
        title="Facebook"
      />

      <Separator marginVertical={5} width="100%" borderWidth={3} />
      <SizableText alignSelf="flex-start" size="$6" marginTop="$2">PopBox Studio</SizableText>
      <ProfileOption
        onPress={handleEditProfile}
        icon={<AntDesign name="questioncircleo" color="white" size={26} />}
        title="Inquiry"
      />
      <ProfileOption
        onPress={handleEditProfile}
        icon={<AntDesign name="infocirlceo" color="white" size={26} />}
        title="About Us"
      />
    </View>
  );
};

export default ProfileOptionList;
