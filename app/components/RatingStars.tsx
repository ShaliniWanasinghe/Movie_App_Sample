import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface Props {
  movieId: number;
}

export default function RatingStars({ movieId }: Props) {
  const [rating, setRating] = useState(0);

  // Load saved rating
  useEffect(() => {
    const loadRating = async () => {
      try {
        const saved = await AsyncStorage.getItem(`rating-${movieId}`);
        if (saved) setRating(Number(saved));
      } catch (error) {
        console.log("Error loading rating:", error);
      }
    };

    loadRating();
  }, [movieId]);

  // Save rating
  const handleRating = async (value: number) => {
    setRating(value);
    await AsyncStorage.setItem(`rating-${movieId}`, value.toString());
  };

  return (
    <View style={{ flexDirection: "row", marginTop: 15 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handleRating(star)}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={32}
            color="#fbbf24"
            style={{ marginRight: 6 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
