import NextAuth, { NextAuthOptions } from "next-auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: "AniListProvider",
      name: "AniList",
      type: "oauth",
      token: "https://anilist.co/api/v2/oauth/token",
      authorization: {
        url: "https://anilist.co/api/v2/oauth/authorize",
        params: { scope: "", response_type: "code" },
      },
      userinfo: {
        url: process.env.GRAPHQL_ENDPOINT,
        async request(context) {
          // console.log(context.tokens.access_token);
          const { data } = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // ...(context.tokens.access_token && {
              Authorization: `Bearer ${context.tokens.access_token}`,
              // }),
            },
            body: JSON.stringify({
              query: `
              query {
                Viewer {
                  id
                  name
                  avatar {
                    large
                    medium
                  }
                  bannerImage
                  mediaListOptions {
                    animeList {
                      customLists
                    }
                  }
                }
              }
            `,
            }),
          }).then((res) => res.json());

          const userLists = data.Viewer?.mediaListOptions.animeList.customLists;

          let custLists = userLists || [];

          if (!userLists?.includes("Watched using AnimeAbyss")) {
            custLists.push("Watched using AnimeAbyss");
            const fetchGraphQL = async (query: string, variables: { lists: any }) => {
              const response = await fetch("https://graphql.anilist.co/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(context.tokens.access_token && {
                    Authorization: `Bearer ${context.tokens.access_token}`,
                  }),
                },
                body: JSON.stringify({ query, variables }),
              });
              return response.json();
            };

            const customLists = async (lists: any) => {
              const setList = `
                  mutation($lists: [String]){
                    UpdateUser(animeListOptions: { customLists: $lists }){
                      id
                    }
                  }
                `;
              const data = await fetchGraphQL(setList, { lists });
              return data;
            };

            await customLists(custLists);
          }

          return {
            token: context.tokens.access_token,
            name: data.Viewer.name,
            sub: data.Viewer.id,
            image: data.Viewer.avatar,
            list: data.Viewer?.mediaListOptions.animeList.customLists,
          };
        },
      },
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      profile(profile, tokens) {
        return {
          id: profile.sub,
          name: profile.name || null,
          email: profile.email || null,
          image: profile.image?.large || null,
          accessToken: tokens.access_token || "",
          list: profile.list || [],
          version: "1.0.1",
        };
      },
    },
    {
      id: "AnimeAbyssProvider",
      name: "AnimeAbyss",
      type: "oauth",
      token: `${API_URL}/api/oauth/token`,
      authorization: {
        url: `${API_URL}/api/oauth/authorize`,
        params: {
          scope: "",
          response_type: "code",
        },
      },
      userinfo: {
        url: `${API_URL}/api/user`,
        async request(context) {
          try {
            // Fetch the user data using the access token
            const { data } = await axios.get(`${API_URL}/api/user`, {
              headers: {
                Authorization: `Bearer ${context.tokens.access_token}`,
              },
            });
      
            // Get the custom lists from the user data
            const userLists = data.user?.mediaListOptions.animeList.customLists || [];
            let custLists = [...userLists];
      
            // If the custom list "Watched using AnimeAbyss" does not exist, add it
            if (!userLists.includes("Watched using AnimeAbyss")) {
              custLists.push("Watched using AnimeAbyss");
      
              // Optionally update the custom list in the backend
              await axios.post(
                `${API_URL}/api/user`,
                { customLists: custLists },
                {
                  headers: {
                    Authorization: `Bearer ${context.tokens.access_token}`,
                  },
                }
              );
            }
      
            // Ensure the return type is of type Profile
            const profile = {
              id: data.user.id || null,
              name: data.user.name || null,
              email: data.user.email || null,
              image: data.user.avatar?.large || null,
              accessToken: context.tokens.access_token || "",
              list: custLists,
              version: "1.0.1", // Optional version
            };
      
            // Return the profile as a valid Profile object (ensure no `null` return)
            return profile;
          } catch (error) {
            console.error("Error fetching user info:", error);
            // Return an empty profile object or handle the error appropriately
            return {
              id: null,
              name: null,
              email: null,
              image: null,
              accessToken: "",
              list: [],
              version: "1.0.1",
            };
          }
        },
      },      
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      profile(profile, tokens) {
        // Return the profile object with relevant user data
        return {
          id: profile.sub,
          name: profile.name || null,
          email: profile.email || null,
          image: profile.image || null,
          accessToken: tokens.access_token || "",
          list: profile.list || [],
          version: "1.0.1", // Add a version if needed
        };
      },
    },
  ],

  session: {
    strategy: "jwt",  // Use JWT for session management
  },

  callbacks: {
    async session({ session, token }) {
      // Add the token data to the session
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.image;
      session.user.accessToken = token.accessToken;
      session.user.provider = token.provider;
      session.user.list = token.list;
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Control where to redirect after a successful login
      return baseUrl;
    },
  },
}

export default NextAuth(authOptions);
