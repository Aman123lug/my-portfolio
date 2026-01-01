import { GraphQLClient, gql } from 'graphql-request';

const HASHNODE_API = 'https://gql.hashnode.com';
const HASHNODE_HOST = 'amanblog.hashnode.dev'; // Your Hashnode blog host

const client = new GraphQLClient(HASHNODE_API);

export interface BlogPost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  publishedAt: string;
  readTimeInMinutes: number;
  coverImage?: {
    url: string;
  };
  tags?: {
    name: string;
  }[];
  content?: {
    html: string;
    markdown: string;
  };
}

export interface HashnodeResponse {
  publication: {
    posts: {
      edges: {
        node: BlogPost;
      }[];
    };
  };
}

export interface SinglePostResponse {
  publication: {
    post: BlogPost;
  };
}

// Fetch all blog posts
export async function getBlogPosts(first: number = 10): Promise<BlogPost[]> {
  const query = gql`
    query GetPosts($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node {
              id
              title
              brief
              slug
              publishedAt
              readTimeInMinutes
              coverImage {
                url
              }
              tags {
                name
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await client.request<HashnodeResponse>(query, {
      host: HASHNODE_HOST,
      first,
    });

    return data.publication.posts.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Fetch a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const query = gql`
    query GetPost($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          id
          title
          brief
          slug
          publishedAt
          readTimeInMinutes
          coverImage {
            url
          }
          tags {
            name
          }
          content {
            html
            markdown
          }
        }
      }
    }
  `;

  try {
    const data = await client.request<SinglePostResponse>(query, {
      host: HASHNODE_HOST,
      slug,
    });

    return data.publication.post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Format date helper
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
