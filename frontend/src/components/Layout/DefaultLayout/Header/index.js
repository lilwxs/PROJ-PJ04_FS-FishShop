import React, { useState, useEffect } from 'react';
import { Link as reactLink, useLocation } from 'react-router-dom';
import { Navbar, Grid, User, Tooltip, Image, Link, Text, Button, Switch, Dropdown } from '@nextui-org/react';
import { connect } from 'react-redux';
import { ShoppingCartIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { deleteUser } from '~/action/action';
import Login from '../../Auth/Login';
import Register from '../../Auth/register';
import logo from '~/assets/logo.png';
import { useCookies } from 'react-cookie';
import Search from '../../components/Search/Search';
import { setItemWithEvent } from '~/components/theme';
const MenuBarItem = [
    { key: 1, path: '/', name: 'Trang chủ' },
    { key: 2, path: '/admin/createproduct', name: 'Tạo sản phẩm' },
    { key: 3, path: '/admin', name: 'Quản lý' },
];

const shoppingCardPage = '/cart';

function Header(props) {
    const [cookie, setCookie, removeCookie] = useCookies('cookie');
    const [theme, setTheme] = useState('light');
    const { user } = props;
    const location = useLocation();
    const [userData, setUser] = useState();
    const [isLogin, SetIsLogin] = useState(false);
    const [path, setPath] = useState('');
    const carts = props.cart.length;

    useEffect(() => {
        if (user?.username) {
            SetIsLogin(true);
            setUser(user);
        } else {
            SetIsLogin(false);
            setUser(null);
        }
    }, [user]);
    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').matches ? setTheme('dark') : setTheme('light');
    }, []);

    useEffect(() => {
        setPath(location.pathname);
    }, [location.pathname]);

    const handleLogout = () => {
        props.deleteUser(user);
        removeCookie('access_token');
        SetIsLogin(false);
    };
    const handleChangeTheme = () => {
        if (theme === 'dark') {
            setItemWithEvent('theme', 'light');
            setTheme('light');
        } else {
            setItemWithEvent('theme', 'dark');
            setTheme('dark');
        }
    };

    return (
        <Navbar isBordered variant="floating" shouldHideOnScroll>
            <Navbar.Brand>
                <Grid.Container gap={2}>
                    <Grid>
                        <Navbar.Content>
                            <Tooltip content={'Trang chủ'} placement="bottom">
                                <Navbar.Link as={reactLink} to="/">
                                    <Image src={logo} css={{ w: 80 }}></Image>
                                    <Text
                                        size={20}
                                        css={{
                                            textGradient: '45deg, $blue600 -20%, $pink600 50%',
                                        }}
                                        weight="bold"
                                    >
                                        Con cá
                                    </Text>
                                </Navbar.Link>
                            </Tooltip>
                        </Navbar.Content>
                    </Grid>
                    <Grid>
                        <Navbar.Content hideIn="xs">
                            <Switch
                                checked={theme === 'dark' ? false : true}
                                size="lg"
                                iconOn={<SunIcon />}
                                iconOff={<MoonIcon />}
                                onChange={handleChangeTheme}
                            />
                            {MenuBarItem.map((item) => (
                                <Tooltip content={item.name} placement="bottom" key={item.key}>
                                    <Navbar.Link
                                        hideIn="md"
                                        as={reactLink}
                                        to={item.path}
                                        isActive={path === item.path ? true : false}
                                    >
                                        {item.name}
                                    </Navbar.Link>
                                </Tooltip>
                            ))}
                        </Navbar.Content>
                    </Grid>
                </Grid.Container>
            </Navbar.Brand>
            <Navbar.Content activeColor="primary" variant="highlight-rounded">
                <Tooltip content="Tìm kiếm" placement="bottom">
                    <Search />
                </Tooltip>

                <Tooltip content="Giỏ hàng" placement="bottom">
                    <Link as={reactLink} to={shoppingCardPage}>
                        <Text span>
                            <ShoppingCartIcon style={{ width: 2 + 'em', height: 2 + 'em', color: '$darkText' }} />
                        </Text>
                    </Link>
                    <span className="w-3 h-3 flex items-center justify-center text-[8px] rounded-full text-white bg-red-500">
                        {carts}
                    </span>
                </Tooltip>

                {isLogin === false ? (
                    <>
                        <Login />
                        <Register />
                    </>
                ) : (
                    <>
                        <User src={user.image} name={user.firstName + ' ' + user.lastName} zoomed>
                            <User.Link as={reactLink} to={`/profile/${user.username}`} target="_self">
                                {user.username}
                            </User.Link>
                        </User>
                        <Button auto onPress={handleLogout} light>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                                />
                            </svg>
                        </Button>
                    </>
                )}
            </Navbar.Content>
        </Navbar>
    );
}
const mapStateToProps = (state) => {
    return {
        cart: state.cart.cartAr,
        total: state.cart.total,
        user: state.user.user,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        deleteUser: (user_current) => dispatch(deleteUser(user_current)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
