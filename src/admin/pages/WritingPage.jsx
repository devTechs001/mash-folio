import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { useContent } from '../../context/ContentContext';
import {
  CollectionList,
  PageHead,
  Panel,
  StringListEditor,
  TextArea,
  TextInput,
} from '../components/AdminUI';

function newArticle() {
  return {
    title: 'New article',
    excerpt: '',
    date: '',
    readingTime: '5 min read',
    tags: [],
    source: 'Dev.to',
    url: '',
  };
}

export default function WritingPage() {
  const { content, setSection } = useContent();
  const { articles } = content;

  return (
    <div className="adm-page">
      <PageHead
        eyebrow="Writing system"
        title="Articles & notes"
        actions={
          <Link to="/#writing" className="adm-btn adm-btn-ghost adm-btn-sm">
            Preview writing <FiExternalLink aria-hidden="true" />
          </Link>
        }
      >
        The latest three articles appear on the home page. Each card links out to the full post.
      </PageHead>

      <Panel title="Articles" description="Newest first. Tags render as small pills.">
        <CollectionList
          items={articles}
          onChange={(next) => setSection('articles', next)}
          create={newArticle}
          itemTitle={(article) => article.title || 'Untitled article'}
          itemMeta={(article) => [article.date, article.readingTime].filter(Boolean).join(' · ')}
          addLabel="Add article"
          renderItem={(article, patch) => (
            <>
              <TextInput
                label="Title"
                value={article.title}
                onChange={(title) => patch({ title })}
              />
              <TextArea
                label="Excerpt"
                rows={3}
                value={article.excerpt}
                onChange={(excerpt) => patch({ excerpt })}
              />

              <div className="adm-grid-2">
                <TextInput
                  label="Date label"
                  value={article.date}
                  onChange={(date) => patch({ date })}
                  hint="Free text, e.g. May 2025"
                />
                <TextInput
                  label="Reading time"
                  value={article.readingTime}
                  onChange={(readingTime) => patch({ readingTime })}
                />
                <TextInput
                  label="Source"
                  value={article.source}
                  onChange={(source) => patch({ source })}
                  hint="Dev.to, Medium, personal blog…"
                />
                <TextInput
                  label="URL"
                  value={article.url}
                  onChange={(url) => patch({ url })}
                  placeholder="https://…"
                />
              </div>

              <StringListEditor
                label="Tags"
                items={article.tags}
                onChange={(tags) => patch({ tags })}
                addLabel="Add tag"
                placeholder="e.g. Performance"
              />
            </>
          )}
        />
      </Panel>
    </div>
  );
}
