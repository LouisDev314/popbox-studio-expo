import ProfileOption from '@/components/profile/ProfileOption';
import React from 'react';
import { AntDesign, Feather, Fontisto, Ionicons, Octicons } from '@expo/vector-icons';
import { Separator, SizableText, View } from 'tamagui';
import { router } from 'expo-router';
import { AppScreen } from '@/enums/screens';
import * as Linking from 'expo-linking';
import { Socials } from '@/enums/socials';

const ProfileOptionList = () => {
  const handleEditProfile = () => {
    console.log('handleEditProfile');
  };

  const handleOpenWishlist = () => {
    router.push({
      pathname: AppScreen.Wishlist,
    });
  };

  const handleOpenSocials = async (social: Socials) => {
    try {
      let socialSchemeURL = '';
      let socialWebURL = '';
      switch (social) {
        case Socials.Instagram:
          socialSchemeURL = 'instagram://user?username=popbox_studio';
          socialWebURL = 'https://www.instagram.com/popbox_studio';
          break;
        case Socials.TikTok:
          // TikTok does not officially provide a stable deep link URL scheme for profiles
          socialSchemeURL = 'https://www.tiktok.com/@popbox_studio';
          socialWebURL = 'https://www.tiktok.com/@popbox_studio';
          break;
        case Socials.Facebook:
          socialSchemeURL = 'https://www.facebook.com/profile.php?id=61574809973184';
          socialWebURL = 'https://www.facebook.com/profile.php?id=61574809973184';
          break;
      }
      const isSupported = await Linking.canOpenURL(socialSchemeURL);
      if (isSupported) {
        return await Linking.openURL(socialSchemeURL);
      } else {
        // App not installed, fallback to browser
        return await Linking.openURL(socialWebURL);
      }
    } catch (err) {
      console.error('Failed to open social app:', err);
    }
  };

  return (
    <View width="100%" justifyContent="space-between">
      <ProfileOption
        onPress={handleEditProfile}
        icon={<Ionicons name="person-outline" color="white" size={26} />}
        title="Manage Profile"
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
        onPress={() => handleOpenSocials(Socials.Instagram)}
        icon={<Feather name="instagram" color="white" size={26} />}
        title="Instagram"
      />
      <ProfileOption
        onPress={() => handleOpenSocials(Socials.TikTok)}
        icon={<Ionicons name="logo-tiktok" color="white" size={26} />}
        title="TikTok"
      />
      <ProfileOption
        onPress={() => handleOpenSocials(Socials.Facebook)}
        icon={<Fontisto name="facebook" color="white" size={26} />}
        title="Facebook"
      />

      <Separator marginVertical={5} width="100%" borderWidth={3} />
      <SizableText alignSelf="flex-start" size="$6" marginTop="$2">PopBox Studio</SizableText>
      <ProfileOption
        onPress={handleEditProfile}
        icon={<AntDesign name="questioncircleo" color="white" size={26} />}
        title="Q&A"
      />
      <ProfileOption
        onPress={handleEditProfile}
        icon={<AntDesign name="infocirlceo" color="white" size={26} />}
        title="About Us"
      />
      <ProfileOption
        onPress={handleEditProfile}
        icon={<Ionicons name="book-outline" color="white" size={26} />}
        title="Policy & Terms of Service"
      />
    </View>
  );
};

export default ProfileOptionList;
