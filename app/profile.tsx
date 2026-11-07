import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const router = useRouter();

  const [favoritesCount, setFavoritesCount] = useState(0);
  const [watchedCount, setWatchedCount] = useState(0);

  // Load actual counts from AsyncStorage on focus
  const loadStats = useCallback(async () => {
    try {
      const favsStored = await AsyncStorage.getItem("favorites");
      const favIds: number[] = favsStored ? JSON.parse(favsStored) : [];
      setFavoritesCount(favIds.length);

      const recentStored = await AsyncStorage.getItem("recentlyViewed");
      const recentIds: number[] = recentStored ? JSON.parse(recentStored) : [];
      setWatchedCount(recentIds.length);
    } catch (e) {
      console.error("Error loading profile stats:", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
          }}
          style={styles.avatar}
        />
        <View style={styles.badge}>
          <Ionicons name="film" size={14} color="#fff" />
        </View>
      </View>

      <Text style={styles.name}>Shalini Wanasinghe</Text>
      <Text style={styles.email}>2021ict75@stu.vau.ac.lk</Text>

      <View style={styles.tagBadge}>
        <Text style={styles.tagText}>Movie Explorer</Text>
      </View>

      {/* Metrics Section */}
      <View style={styles.statsSection}>
        {/* Total Watched / Recently Viewed */}
        <TouchableOpacity
          style={styles.infoBox}
          onPress={() => router.push("/")}
          activeOpacity={0.8}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#0284c720" }]}>
            <Ionicons name="film" size={22} color="#38bdf8" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Total Watched</Text>
            <Text style={styles.infoValue}>{watchedCount}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748b" />
        </TouchableOpacity>

        {/* Dynamic Favorites Metric */}
        <TouchableOpacity
          style={styles.infoBox}
          onPress={() => router.push("/favorites")}
          activeOpacity={0.8}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#ef444420" }]}>
            <Ionicons name="heart" size={22} color="#ef4444" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Favorites</Text>
            <Text style={styles.infoValue}>{favoritesCount}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/")}
        activeOpacity={0.8}
      >
        <Ionicons name="home-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Go Back Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  contentContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 110,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#38bdf8",
  },
  badge: {
    position: "absolute",
    bottom: 2,
    right: 4,
    backgroundColor: "#2563eb",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0f172a",
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  email: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  tagBadge: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 28,
  },
  tagText: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "600",
  },
  statsSection: {
    width: "100%",
    maxWidth: 400,
    gap: 12,
    marginBottom: 30,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 2,
  },
  infoValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e293b",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    width: "100%",
    maxWidth: 400,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
