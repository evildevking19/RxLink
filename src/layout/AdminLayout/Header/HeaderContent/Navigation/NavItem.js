import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project import
import { activeItem } from 'store/reducers/menu';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level, hidden }) => {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { drawerOpen, openItem } = useSelector((state) => state.menu);

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id) => {
    dispatch(activeItem({ openItem: [id] }));
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: '1rem' }} /> : false;

  const isSelected = openItem.findIndex((id) => id === item.id) > -1;
  // active menu item on page load
  useEffect(() => {
    if (pathname.includes(item.url)) {
      dispatch(activeItem({ openItem: [item.id] }));
    }
    // eslint-disable-next-line
  }, [pathname]);

  const textColor = '#888';
  const iconSelectedColor = 'text.primary';

  return (
    <ListItemButton
      className={hidden ? 'hidden' : ''}
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => itemHandler(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        px: 2,
        mx: '5px',
        borderRadius: 8,
        ...{
          '&:hover': {
            bgcolor: 'white'
          },
          '&.Mui-selected': {
            bgcolor: 'white',
            color: iconSelectedColor,
            '&:hover': {
              color: iconSelectedColor,
              bgcolor: 'white'
            }
          }
        }
      }}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            justifyContent: drawerOpen ? 'start' : 'center'
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
              {item.title}
            </Typography>
          }
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
