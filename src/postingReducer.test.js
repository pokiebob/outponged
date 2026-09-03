import reducePostings from './postingReducer';

describe('reducePostings', () => {
  it('keeps only post entries and groups direct comments under each post', () => {
    const input = [
      {
        postType: 'post',
        postId: 'post-1',
        date: '2026-01-01T00:00:00.000Z',
        ownerName: 'Owner',
      },
      {
        postType: 'comment',
        postId: 'comment-1',
        ultimateParentPostId: 'post-1',
        date: '2026-01-01T01:00:00.000Z',
        ownerName: 'Commenter',
      },
      {
        postType: 'comment',
        postId: 'comment-2',
        ultimateParentPostId: 'post-1',
        date: '2026-01-01T02:00:00.000Z',
      },
      {
        postType: 'post',
        postId: 'post-2',
        date: '2026-01-02T00:00:00.000Z',
        ownerName: 'Another Owner',
      },
    ];

    const result = reducePostings(input);
    const postIds = result.map((post) => post.postId);

    expect(postIds).toEqual(['post-1', 'post-2']);
    expect(result[0].comments).toHaveLength(2);
    expect(result[0].comments.map((comment) => comment.postId)).toEqual(['comment-1', 'comment-2']);
    expect(result[1].comments).toHaveLength(0);
    expect(result[0].date).toBe(new Date('2026-01-01T00:00:00.000Z').toLocaleDateString());
  });

  it('returns stable output for empty postings', () => {
    expect(reducePostings([])).toEqual([]);
    expect(reducePostings(undefined)).toEqual([]);
  });

  it('does not include comments with unknown parent IDs', () => {
    const input = [
      {
        postType: 'post',
        postId: 'post-1',
        date: '2026-01-01T00:00:00.000Z',
      },
      {
        postType: 'comment',
        postId: 'orphan-comment',
        ultimateParentPostId: 'does-not-exist',
      },
    ];

    const output = reducePostings(input);
    expect(output[0].comments).toEqual([]);
  });
});
