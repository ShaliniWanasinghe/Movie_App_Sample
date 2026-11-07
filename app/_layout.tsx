import { Ionicons } from "@expo/vector-icons";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "";
  const isFavorites = pathname === "/favorites";
  const isProfile = pathname === "/profile";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* App Screens */}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />

      {/* Footer Navigation Container */}
      <View style={styles.footerContainer}>
        {/* Buttons Row */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/")}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isHome ? "home" : "home-outline"}
              size={22}
              color={isHome ? "#38bdf8" : "#94a3b8"}
            />
            <Text
              style={[
                styles.navText,
                { color: isHome ? "#38bdf8" : "#94a3b8", fontWeight: isHome ? "700" : "500" },
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/favorites")}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorites ? "heart" : "heart-outline"}
              size={22}
              color={isFavorites ? "#ef4444" : "#94a3b8"}
            />
            <Text
              style={[
                styles.navText,
                { color: isFavorites ? "#ef4444" : "#94a3b8", fontWeight: isFavorites ? "700" : "500" },
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/profile")}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isProfile ? "person" : "person-outline"}
              size={22}
              color={isProfile ? "#38bdf8" : "#94a3b8"}
            />
            <Text
              style={[
                styles.navText,
                { color: isProfile ? "#38bdf8" : "#94a3b8", fontWeight: isProfile ? "700" : "500" },
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Made by Shalini Wanasinghe watermark */}
        <Text style={styles.creditsText}>Made by Shalini Wanasinghe</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1e293b",
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    marginTop: 3,
  },
  creditsText: {
    color: "#94a3b8",
    fontSize: 11,
    textAlign: "center",
    marginTop: 6,
    letterSpacing: 0.5,
  },
});
