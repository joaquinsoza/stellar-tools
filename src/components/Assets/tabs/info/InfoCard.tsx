import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";
import { FC } from "react";

type AssetInfoProps = {
  title: string;
  content: string | number;
  icon: string;
};

export const InfoCard: FC<AssetInfoProps> = ({
  title = "-",
  content = "-",
  icon,
}) => {
  return (
    <Card variant="filled" maxWidth={400}>
      <CardHeader>
        <Image src={icon} alt={`${icon} icon`} width={10} height={10} />
      </CardHeader>
      <CardBody>
        <Heading
          fontWeight="normal"
          letterSpacing={0.5}
          color="gray"
          size="md"
          mb={5}
        >
          {title ? title.toUpperCase() : ""}
        </Heading>
        <Text color="#5C5C5C" textStyle="6xl" fontWeight="bold">
          {typeof content === "number" ? content : content.toUpperCase()}
        </Text>
      </CardBody>
    </Card>
  );
};
