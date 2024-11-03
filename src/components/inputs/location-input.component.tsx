import React, { useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import styled from "styled-components";
import { GOOGLE_PLACES_KEY } from "@env";
import { TextInput } from "react-native-paper";
import { useTheme } from "styled-components/native";

const StyledGooglePlacesAutocomplete = styled(GooglePlacesAutocomplete).attrs(
  (props) => ({
    placeholder: props.placeholder,
    fetchDetails: true,
    styles: {
      textInput: {
        ...props.theme.typography.bodyLarge,
      },
    },
  })
)``;

interface LocationInputProps {
  placeholder: string;
  language?: string;
  country?: string;
  onPress?: (data: any, details: any) => void;
  autoFocus?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder = "Enter address",
  language = "lv",
  country = "lv",
  onPress,
  autoFocus,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const getAddressComponents = (data: any, details: any) => {
    if (details) {
      const addressComponents = details.address_components;

      const getAddressComponent = (type: string) => {
        const component = addressComponents.find((comp: { types: string[] }) =>
          comp.types.includes(type)
        );
        return component ? component.long_name : "";
      };

      const address = `${getAddressComponent("route")} ${getAddressComponent(
        "street_number"
      )}`;
      const city =
        getAddressComponent("locality") ||
        getAddressComponent("administrative_area_level_1");
      const region =
        getAddressComponent("administrative_area_level_2") ||
        getAddressComponent("administrative_area_level_1");
      const country = getAddressComponent("country");
      const postalCode = getAddressComponent("postal_code");

      return {
        address,
        city,
        region,
        country,
        postalCode,
      };
    }
    return {
      address: "",
      city: "",
      country: "",
      postalCode: "",
    };
  };

  return (
    <StyledGooglePlacesAutocomplete
      placeholder={placeholder}
      onPress={(data, details = null) => {
        if (onPress && details) {
          const location = getAddressComponents(data, details);
          onPress(location, details);
        }
      }}
      textInputProps={{
        InputComp: TextInput,
        mode: "outlined",
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        autoFocus: autoFocus,
        left: isFocused ? undefined : (
          <TextInput.Icon icon={"map-search-outline"} />
        ),
        underlineColor: "transparent",
        activeOutlineColor: theme.colors.primary.dark,
        style: {
          backgroundColor: "transparent",
          selectionColor: theme.colors.primary.dark,
          cursorColor: theme.colors.primary.dark,
          flexGrow: 1,
          height: 47,
          textAlignVertical: "center",
        },
        outlineStyle: {
          borderRadius: 27,
          paddingTop: 0,
          borderColor: theme.colors.primary.dark,
        },
      }}
      query={{
        key: GOOGLE_PLACES_KEY,
        language: language,
        components: `country:lv`,
      }}
      listViewDisplayed={true}
      fetchDetails={true}
    />
  );
};

export default LocationInput;
