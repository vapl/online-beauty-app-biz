import barbershopIcon from "../assets/icons/services-icons/barbershop.png";
import hairdresserIcon from "../assets/icons/services-icons/hair-dryer.png";
import cosmetologyIcon from "../assets/icons/services-icons/cosmetology.png";
import spaIcon from "../assets/icons/services-icons/towel.png";
import nailsIcon from "../assets/icons/services-icons/pedicure.png";
import epilationLaserIcon from "../assets/icons/services-icons/device.png";
import waxingIcon from "../assets/icons/services-icons/waxing.png";
import massageIcon from "../assets/icons/services-icons/body-massage.png";
import fitnessIcon from "../assets/icons/services-icons/yoga-pose.png";
import tattooIcon from "../assets/icons/services-icons/tattoo-machine.png";
import makeupIcon from "../assets/icons/services-icons/makeup.png";
import lashesBrowsIcon from "../assets/icons/services-icons/eye.png";
import solarium from "../assets/icons/services-icons/solarium.png";
import customIcon from "../assets/icons/services-icons/custom.png";

interface BeautyServicesProps {
  key: number;
  icon: any;
  label: string;
}

export const getBeautyServices = (
  t: (key: string) => string
): BeautyServicesProps[] => [
  {
    key: 1,
    icon: hairdresserIcon,
    label: t("services_hairdresser"),
  },
  {
    key: 2,
    icon: barbershopIcon,
    label: t("services_barbershop"),
  },
  {
    key: 3,
    icon: cosmetologyIcon,
    label: t("services_cosmetologist"),
  },
  {
    key: 4,
    icon: spaIcon,
    label: t("services_spa"),
  },
  {
    key: 5,
    icon: nailsIcon,
    label: t("services_manicure_pedicure"),
  },
  {
    key: 6,
    icon: epilationLaserIcon,
    label: t("services_laser_epilation"),
  },
  {
    key: 7,
    icon: waxingIcon,
    label: t("services_waxing"),
  },
  {
    key: 8,
    icon: massageIcon,
    label: t("services_massage"),
  },
  {
    key: 9,
    icon: fitnessIcon,
    label: t("services_fitness"),
  },
  {
    key: 10,
    icon: tattooIcon,
    label: t("services_tattoo_piercing"),
  },
  {
    key: 11,
    icon: makeupIcon,
    label: t("services_makeup"),
  },
  {
    key: 12,
    icon: lashesBrowsIcon,
    label: t("services_lashes_brows"),
  },
  {
    key: 13,
    icon: solarium,
    label: t("services_solarium"),
  },
  {
    key: 14,
    icon: customIcon,
    label: t("services_other"),
  },
];
