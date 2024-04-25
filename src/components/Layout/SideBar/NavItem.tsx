import { FlexProps, Flex, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface NavItemProps extends FlexProps {
  icon: IconType;
  href: string;
  children: React.ReactNode;
}

export const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  return (
    <Link href={href}>
      <Flex
        align='center'
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'pink.400',
          color: 'white',
        }}
        {...rest}
      >
        <Icon
          mr={4}
          fontSize='24'
          _groupHover={{
            color: 'white',
          }}
          as={icon}
        />
        {children}
      </Flex>
    </Link>
  );
};
