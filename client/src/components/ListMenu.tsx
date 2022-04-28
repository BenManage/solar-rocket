import { FC, SyntheticEvent, MouseEvent, useState } from "react";
import { Button, MenuItem, Menu, ButtonProps } from "@mui/material";

interface ListMenuProps extends ButtonProps {
  options: [string, ...string[]];
  onSelectionChange?(event: SyntheticEvent | Event, value: String): any;
}

const ListMenu: FC<ListMenuProps> = (props: ListMenuProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event: MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index);
    if (props.onSelectionChange) {
      props.onSelectionChange(event, props.options[index]);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{ color: "text.primary" }}
        endIcon={props.endIcon}
        startIcon={props.startIcon}
        size="large"
      >
        {props.options[selectedIndex]}
      </Button>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        {props.options.map((option: string, index: number) => (
          <MenuItem
            key={index}
            onClick={(event) => handleMenuClick(event, index)}
            selected={selectedIndex === index}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export { ListMenu };
