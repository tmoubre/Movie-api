PGDMP                  	    |           MyFlixDB    16.4    16.4 +               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16398    MyFlixDB    DATABASE     �   CREATE DATABASE "MyFlixDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "MyFlixDB";
                postgres    false            �            1259    16409 	   directors    TABLE     �   CREATE TABLE public.directors (
    directorid integer NOT NULL,
    name character varying(50) NOT NULL,
    bio character varying(1000),
    birthyear date,
    deathyear date
);
    DROP TABLE public.directors;
       public         heap    postgres    false            �            1259    16408    directors_directorid_seq    SEQUENCE     �   CREATE SEQUENCE public.directors_directorid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.directors_directorid_seq;
       public          postgres    false    218                       0    0    directors_directorid_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.directors_directorid_seq OWNED BY public.directors.directorid;
          public          postgres    false    217            �            1259    16400    genres    TABLE     �   CREATE TABLE public.genres (
    genreid integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(1000)
);
    DROP TABLE public.genres;
       public         heap    postgres    false            �            1259    16399    genres_genreid_seq    SEQUENCE     �   CREATE SEQUENCE public.genres_genreid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.genres_genreid_seq;
       public          postgres    false    216                       0    0    genres_genreid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.genres_genreid_seq OWNED BY public.genres.genreid;
          public          postgres    false    215            �            1259    16418    movies    TABLE     
  CREATE TABLE public.movies (
    movieid integer NOT NULL,
    title character varying(50) NOT NULL,
    description character varying(1000),
    directorid integer NOT NULL,
    genreid integer NOT NULL,
    imageurl character varying(300),
    featured boolean
);
    DROP TABLE public.movies;
       public         heap    postgres    false            �            1259    16417    movies_movieid_seq    SEQUENCE     �   CREATE SEQUENCE public.movies_movieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.movies_movieid_seq;
       public          postgres    false    220                       0    0    movies_movieid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.movies_movieid_seq OWNED BY public.movies.movieid;
          public          postgres    false    219            �            1259    16444    user_movies    TABLE     o   CREATE TABLE public.user_movies (
    usermovieid integer NOT NULL,
    userid integer,
    movieid integer
);
    DROP TABLE public.user_movies;
       public         heap    postgres    false            �            1259    16443    user_movies_usermovieid_seq    SEQUENCE     �   CREATE SEQUENCE public.user_movies_usermovieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.user_movies_usermovieid_seq;
       public          postgres    false    224                       0    0    user_movies_usermovieid_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.user_movies_usermovieid_seq OWNED BY public.user_movies.usermovieid;
          public          postgres    false    223            �            1259    16437    users    TABLE     �   CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    birth_date date
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16436    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public          postgres    false    222                       0    0    users_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;
          public          postgres    false    221            e           2604    16412    directors directorid    DEFAULT     |   ALTER TABLE ONLY public.directors ALTER COLUMN directorid SET DEFAULT nextval('public.directors_directorid_seq'::regclass);
 C   ALTER TABLE public.directors ALTER COLUMN directorid DROP DEFAULT;
       public          postgres    false    217    218    218            d           2604    16403    genres genreid    DEFAULT     p   ALTER TABLE ONLY public.genres ALTER COLUMN genreid SET DEFAULT nextval('public.genres_genreid_seq'::regclass);
 =   ALTER TABLE public.genres ALTER COLUMN genreid DROP DEFAULT;
       public          postgres    false    215    216    216            f           2604    16421    movies movieid    DEFAULT     p   ALTER TABLE ONLY public.movies ALTER COLUMN movieid SET DEFAULT nextval('public.movies_movieid_seq'::regclass);
 =   ALTER TABLE public.movies ALTER COLUMN movieid DROP DEFAULT;
       public          postgres    false    220    219    220            h           2604    16447    user_movies usermovieid    DEFAULT     �   ALTER TABLE ONLY public.user_movies ALTER COLUMN usermovieid SET DEFAULT nextval('public.user_movies_usermovieid_seq'::regclass);
 F   ALTER TABLE public.user_movies ALTER COLUMN usermovieid DROP DEFAULT;
       public          postgres    false    223    224    224            g           2604    16440    users userid    DEFAULT     l   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    222    221    222            	          0    16409 	   directors 
   TABLE DATA                 public          postgres    false    218   e.                 0    16400    genres 
   TABLE DATA                 public          postgres    false    216   �1                 0    16418    movies 
   TABLE DATA                 public          postgres    false    220   �3                 0    16444    user_movies 
   TABLE DATA                 public          postgres    false    224   �8                 0    16437    users 
   TABLE DATA                 public          postgres    false    222   99                  0    0    directors_directorid_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.directors_directorid_seq', 9, true);
          public          postgres    false    217                       0    0    genres_genreid_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.genres_genreid_seq', 3, true);
          public          postgres    false    215                       0    0    movies_movieid_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.movies_movieid_seq', 10, true);
          public          postgres    false    219                       0    0    user_movies_usermovieid_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.user_movies_usermovieid_seq', 3, true);
          public          postgres    false    223                       0    0    users_userid_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_userid_seq', 3, true);
          public          postgres    false    221            l           2606    16416    directors directors_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.directors
    ADD CONSTRAINT directors_pkey PRIMARY KEY (directorid);
 B   ALTER TABLE ONLY public.directors DROP CONSTRAINT directors_pkey;
       public            postgres    false    218            j           2606    16407    genres genres_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (genreid);
 <   ALTER TABLE ONLY public.genres DROP CONSTRAINT genres_pkey;
       public            postgres    false    216            n           2606    16425    movies movies_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movieid);
 <   ALTER TABLE ONLY public.movies DROP CONSTRAINT movies_pkey;
       public            postgres    false    220            r           2606    16449    user_movies user_movies_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.user_movies
    ADD CONSTRAINT user_movies_pkey PRIMARY KEY (usermovieid);
 F   ALTER TABLE ONLY public.user_movies DROP CONSTRAINT user_movies_pkey;
       public            postgres    false    224            p           2606    16442    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    222            s           2606    16431    movies directorkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.movies
    ADD CONSTRAINT directorkey FOREIGN KEY (directorid) REFERENCES public.directors(directorid);
 <   ALTER TABLE ONLY public.movies DROP CONSTRAINT directorkey;
       public          postgres    false    220    4716    218            t           2606    16426    movies genrekey    FK CONSTRAINT     t   ALTER TABLE ONLY public.movies
    ADD CONSTRAINT genrekey FOREIGN KEY (genreid) REFERENCES public.genres(genreid);
 9   ALTER TABLE ONLY public.movies DROP CONSTRAINT genrekey;
       public          postgres    false    216    4714    220            u           2606    16455    user_movies moviekey    FK CONSTRAINT     y   ALTER TABLE ONLY public.user_movies
    ADD CONSTRAINT moviekey FOREIGN KEY (movieid) REFERENCES public.movies(movieid);
 >   ALTER TABLE ONLY public.user_movies DROP CONSTRAINT moviekey;
       public          postgres    false    220    224    4718            v           2606    16450    user_movies userkey    FK CONSTRAINT     u   ALTER TABLE ONLY public.user_movies
    ADD CONSTRAINT userkey FOREIGN KEY (userid) REFERENCES public.users(userid);
 =   ALTER TABLE ONLY public.user_movies DROP CONSTRAINT userkey;
       public          postgres    false    224    222    4720            	   ~  x��V�r�H��)�fS.!c��I��൝]������ 5h��5#�(�}���@9�k��7�0�M�\���V�|��7L�g����?��U9�d|�H�q�����O��I���4��}�"�Y�6%,6?[�6�}���Q�M�����2�Xq���o��͘ƿ�t�ѕa���[��'%i-3�����W�7����2�s���^3���c��,�Y�<g�a<G�0	BX�8�ܷҹT��ZYZhCE
G�b�p^7�m$B}���!z6	�PQi��Y��י�ssx�����n�	N�t�x{�zu0����jdDB?s]h�2��"�-�I�J�V7��Z�i��JԊ�F��jE��֜�8cki���|�j[����4��C�(�a�M3d�Tb�:�ik��T�+�do����}��"��14#��B�sDx��g�����v��^�<A�_E�
S�e�I3U'l����U�_�/c(��QK��)�eARQ=�d��;��Y�:ں@[��Rm��4v�.|+[����N��+"=�z���D�� m�Q��NʸA��eݝ��4-�����L/k?���~�|i�n���^�=E�k��O��n�FFҦ(����Q�m�2�͡�X�A��A�N�-�;��te�h�e�B���G>�6��Qa5S�v�����[G��H���]m(�]������+�}������	>��P�1��L'��2^a��Y��N7�w������H��10#�o_E+���*m��:T��Y�%+̶�XwЙp+���LT�㉲2�J�0w��l7w�{m����V��1�Q��2�yNv��b4t�bapO܈X�)����)��$��J��@�j�}���+VckR�s�y���Lq����}�w����f�%r�z��BB��z:8�9�         �  x���O��0���s�*GN�P	�J���ę$��O�q����9)]G�"�r<o��y��/��?�h�[�n7H�bt���59HC���:M�~|�����>4�5��z�b�ԫ�R��lP���*����%�M8�i���D^�3
c*UB2{!vN�"�
��J��v��O���e��_ࡻlo;R#�I�K#�Gu#��b�$L#��K��9����(&K�-y�T��H�(K=�݊��<Tɜ��Ā$bG!YA�"��"�W�)r#gvE�ZQ�)�&�l$}/��@��k����a���%`C�-�1�s$6��&���7��r-kV�mN��5-Oɟ`K^��770�X�^���\\�ϗ
�\U��my8�('-�z��- �����%L�̕��Mf�SWu��<
N���E��aJf
ͅ�f��*.B         	  x��W�n�F}�W̋�PD[��}Rd;��\`9.�bEŭ���riE~�?�+���~I�P�V�:*P��g�gΙ���������SYO�Nڅ��\ѳ�W�-
:nQ�U�u��Xh�Ip^�O���Pjʵ7-�X��s���{��gczvТ���e��|���{�?:��C��u�,q���6a�t"o¯)�o㔔M)q/J��:�z2�S���km[�ot�;1�y�B���miԜf:�4��q�t�6` Z`���$���8��g�F�j�v~ɪ�U�6
y]L���IH��#��tU`����i��엟^|�9����h���'��K	���6�Ⱥ�G~���Ni���=�\�w�*R��in�T���Mm!>���)3��B�\���f0M��N"��͔O��Z�pf��
�V#�B��G���w��
�xb��9��
a9c�Lb�tȔ6`�\$���&b��G���m*押����&.H�t�˕,����X����U6�v�,_7�A�tfߥL�'���yӇ��yS�����f���:�,�~��#괟#����٢1^��҈�Ʉ!WPv���#!&��9��"�5f�s�K����s�����4:D��<aCo����?�������8Q~�o��ۖ
����ڔ������S�S����B��Q�ƛ�.�h�N=�a��
�m�zK�T�o5�~������smR��slB���t���+0����!�m�!n��M�[�}q	1 ��̤�I�e+|6�$gS.��C�)gh��L4G�b�=�hA��J#�f�[�o?sޤ����1��4jX���xדּw�����y�@�x��f�n�y�{z.�bS�D?e9�V���sP��ݟ���2f14��lڏ�r:���BYQ�p;��(ɢ%��e1��������{��@�@ś&���N���ugE	__�C�7�2����o���0D�
�^�K���S�u����{�c��y��˿�@��r`��V b��F D�,Z��} G3�&���yڧ�+tRQ��
m}�]h~���T��M�M"�x��\?�z���1��t���C�T���Ƃ�����a[>��WE��]�	Nˎ��D��g�S3F�
9���*�s�m��e���ַ��Hb��$�U`������C�g���E&m���b��I�Q��XL�����b��j�
0�^c��z9�[\00�~V�K��ڨ �P��	[s���sB�B�ü��8�x���^5Wʧ���`e�� |͠�ɓ <v]         ]   x���v
Q���W((M��L�+-N-���/�L-V� q���DC4�}B]�4u��HӚ˓*�i@5�u��h �MP         �   x���M�@��������_I<a��5V�L�����Z��43�0�Û�Y|8B��0�yS��)��R��ڑ�0Χ�͌��n�k&n����y�;�h� U�cΨ:w[F����=���D�ED��B��i{&ª�V�_�Ũ*i�<Î���*��(U��*����6������/�t^�;ו�`$]�	�O�t     