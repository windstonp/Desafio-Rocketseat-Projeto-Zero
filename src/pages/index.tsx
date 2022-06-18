import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [postPaginationData, setPostPaginationData] = useState(postsPagination);
  return (
    <>
      <Head>
        <title>Posts | spaceTraveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {postPaginationData.results.map(post => (
            <Link href={`posts/${post.uid}`} key={post.uid}>
              <a>
                <strong className={commonStyles.postTitle}>
                  {post.data.title}
                </strong>
                <p className={commonStyles.postSubtitle}>
                  {post.data.subtitle}
                </p>
                <div className={commonStyles.postDetail}>
                  <time>
                    <FiCalendar />
                    {format(
                      new Date(post.first_publication_date),
                      'd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                  <p>
                    <FiUser />
                    {post.data.author}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {postPaginationData.next_page && (
          <button
            className={styles.loadMoreButton}
            type="button"
            onClick={handleLoadMore}
          >
            Carregar mais.
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts');
  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
